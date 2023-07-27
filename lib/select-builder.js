'use strict';

const { iter } = require('@metarhia/iterator');

const { checkTypeOrQuery, makeKeyWithAlias } = require('./query-builder.js');
const { QueryConditionsBuilder } = require('./query-conditions-builder.js');
const { mapJoinIterable } = require('./utils.js');

const functionHandlers = {
  count: (op) => `count(${op.field})`,
  avg: (op) => `avg(${op.field})`,
  min: (op) => `min(${op.field})`,
  max: (op) => `max(${op.field})`,
  sum: (op) => `sum(${op.field})`,
};

class SelectBuilder extends QueryConditionsBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      select: new Set(),
      selectDistinct: false,
      innerJoin: [],
      groupBy: new Set(),
      orderBy: [],
      from: [],
      limit: null,
      offset: null,
    };
  }

  from(tableName, alias) {
    this.operations.from.push({
      table: this.escapeIdentifier(tableName),
      alias: alias && this.escapeIdentifier(alias),
    });
    return this;
  }

  select(...fields) {
    const select = this.operations.select;
    for (const f of fields) {
      select.add(this.escapeKey(f));
    }
    return this;
  }

  selectAs(field, alias) {
    return this._addSelectClause(undefined, field, alias);
  }

  innerJoin(tableName, leftKey, rightKey) {
    this.operations.innerJoin.push({
      table: this.escapeIdentifier(tableName),
      leftKey: this.escapeKey(leftKey),
      rightKey: this.escapeKey(rightKey),
    });
    return this;
  }

  distinct() {
    this.operations.selectDistinct = true;
    return this;
  }

  orderBy(field, dir = 'ASC') {
    this.operations.orderBy.push({
      field: this.escapeKey(field),
      dir: dir.toUpperCase(),
    });
    return this;
  }

  groupBy(...fields) {
    const groupBy = this.operations.groupBy;
    for (const f of fields) {
      groupBy.add(this.escapeKey(f));
    }
    return this;
  }

  limit(limit) {
    checkTypeOrQuery(limit, 'limit', 'number');
    this.operations.limit = limit;
    return this;
  }

  offset(offset) {
    checkTypeOrQuery(offset, 'offset', 'number');
    this.operations.offset = offset;
    return this;
  }

  _addSelectClause(type, field, alias) {
    this.operations.select.add({
      type,
      field: this.escapeKey(field),
      alias: alias && this.escapeIdentifier(alias),
    });
    return this;
  }

  count(field = '*', alias) {
    return this._addSelectClause('count', field, alias);
  }

  avg(field, alias) {
    return this._addSelectClause('avg', field, alias);
  }

  min(field, alias) {
    return this._addSelectClause('min', field, alias);
  }

  max(field, alias) {
    return this._addSelectClause('max', field, alias);
  }

  sum(field, alias) {
    return this._addSelectClause('sum', field, alias);
  }

  // #private
  _whereValueMapper(subquery) {
    return selectSubqueryBuilder(subquery, this);
  }

  // #private
  _processFrom(from) {
    return mapJoinIterable(from, makeKeyWithAlias, ', ');
  }

  _processDistinct() {
    return 'DISTINCT';
  }

  // #private
  _processSelect(select) {
    if (select.size === 0) return '*';
    return mapJoinIterable(
      select,
      (op) => {
        if (typeof op === 'string') return op;
        let clause =
          op.type === undefined ? op.field : functionHandlers[op.type](op);
        if (op.alias) clause += ` AS ${op.alias}`;
        return clause;
      },
      ', '
    );
  }

  // #private
  _processOrder(clauses) {
    return mapJoinIterable(clauses, (o) => `${o.field} ${o.dir}`, ', ');
  }

  build() {
    let query = 'SELECT';

    if (this.operations.selectDistinct) query += ` ${this._processDistinct()}`;

    query += ' ' + this._processSelect(this.operations.select);

    if (this.operations.from.length === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += ` FROM ${this._processFrom(this.operations.from)}`;

    for (const { table, leftKey, rightKey } of this.operations.innerJoin) {
      query += ` INNER JOIN ${table} ON ${leftKey} = ${rightKey}`;
    }

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses}`;
    }

    if (this.operations.groupBy.size > 0) {
      query += ` GROUP BY ${iter(this.operations.groupBy).join(', ')}`;
    }

    if (this.operations.orderBy.length > 0) {
      query += ` ORDER BY ${this._processOrder(this.operations.orderBy)}`;
    }

    if (this.operations.limit) {
      query += ` LIMIT ${this.makeParamValue(this.operations.limit)}`;
    }

    if (this.operations.offset) {
      query += ` OFFSET ${this.makeParamValue(this.operations.offset)}`;
    }

    return query;
  }
}

function selectSubqueryBuilder(subquery, builder) {
  return typeof subquery === 'function'
    ? subquery(new SelectBuilder(builder.params, builder.options))
    : subquery;
}

module.exports = { SelectBuilder, selectSubqueryBuilder };
