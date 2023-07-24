'use strict';

const { iter } = require('@metarhia/common');

const { makeParamValue } = require('./query-builder');
const { checkTypeOrQuery, mapJoinIterable } = require('./utils');
const { QueryConditionsBuilder } = require('./query-conditions-builder');

const functionHandlers = {
  count: op => `count(${op.field})`,
  avg: op => `avg(${op.field})`,
  min: op => `min(${op.field})`,
  max: op => `max(${op.field})`,
  sum: op => `sum(${op.field})`,
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
    const table = this.escapeIdentifier(tableName);
    this.operations.from.push({ table, alias: alias && this.escapeKey(alias) });
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
    if (alias) alias = this.escapeKey(alias);
    this.operations.select.add({
      type,
      field: this.escapeKey(field),
      alias,
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

  _whereValueMapper(subquery) {
    return typeof subquery === 'function'
      ? subquery(new SelectBuilder(this.params, this.options))
      : subquery;
  }

  _processFrom(from) {
    return mapJoinIterable(
      from,
      f => (!f.alias ? String(f.table) : `${f.table} AS ${f.alias}`),
      ', '
    );
  }

  _processSelect(select) {
    if (select.size === 0) return '*';
    return mapJoinIterable(
      select,
      op => {
        if (typeof op === 'string') return op;
        let clause =
          op.type === undefined ? op.field : functionHandlers[op.type](op);
        if (op.alias) clause += ` AS ${op.alias}`;
        return clause;
      },
      ', '
    );
  }

  _processOrder(clauses) {
    return mapJoinIterable(clauses, o => `${o.field} ${o.dir}`, ', ');
  }

  build() {
    let query = 'SELECT';

    if (this.operations.selectDistinct) query += ' DISTINCT';

    query += ' ' + this._processSelect(this.operations.select);

    const tableNames = this.operations.from;
    if (tableNames.length === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += ' FROM ' + this._processFrom(tableNames);

    for (const { table, leftKey, rightKey } of this.operations.innerJoin) {
      query += ` INNER JOIN ${table} ON ${leftKey} = ${rightKey}`;
    }

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses;
    }

    const groupClauses = this.operations.groupBy;
    if (groupClauses.size > 0) {
      query += ' GROUP BY ' + iter(groupClauses).join(', ');
    }

    const orderClauses = this.operations.orderBy;
    if (orderClauses.length > 0) {
      query += ' ORDER BY ' + this._processOrder(orderClauses);
    }

    const limit = this.operations.limit;
    if (limit) {
      query += ` LIMIT ${makeParamValue(limit, this.params)}`;
    }

    const offset = this.operations.offset;
    if (offset) {
      query += ` OFFSET ${makeParamValue(offset, this.params)}`;
    }

    return query;
  }
}

module.exports = { SelectBuilder };
