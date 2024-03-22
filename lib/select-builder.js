'use strict';

const {
  QueryBuilder,
  checkTypeOrQuery,
  makeKeyWithAlias,
} = require('./query-builder.js');
const { QueryConditionsBuilder } = require('./query-conditions-builder.js');
const { mapJoinIterable } = require('./utils.js');

const functionHandlers = {
  default: (op) => `${op.type}(${op.field})`,
};

class SelectBuilder extends QueryConditionsBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      select: new Set(),
      selectDistinct: false,
      join: [],
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
    for (const f of fields) {
      this.selectAs(f, null);
    }
    return this;
  }

  selectAs(fieldOrBuilder, alias) {
    return this._addSelectClause(undefined, fieldOrBuilder, alias);
  }

  selectFn(fn, field, alias) {
    return this._addSelectClause(fn, field, alias);
  }

  selectRaw(sqlOrBuilder) {
    this.operations.select.add({ raw: sqlOrBuilder });
    return this;
  }

  innerJoin(tableName, leftKey, rightKey) {
    return this.innerJoinAs(tableName, null, leftKey, rightKey);
  }

  innerJoinAs(tableName, alias, leftKey, rightKey) {
    this.join('INNER', tableName, alias, leftKey, rightKey);
    return this;
  }

  innerJoinCond(tableName, condition) {
    return this.innerJoinCondAs(tableName, null, condition);
  }

  innerJoinCondAs(tableName, alias, condition) {
    this.joinCond('INNER', tableName, alias, condition);
    return this;
  }

  leftJoin(tableName, leftKey, rightKey) {
    return this.leftJoinAs(tableName, null, leftKey, rightKey);
  }

  leftJoinAs(tableName, alias, leftKey, rightKey) {
    this.join('LEFT OUTER', tableName, alias, leftKey, rightKey);
    return this;
  }

  leftJoinCond(tableName, condition) {
    return this.leftJoinCondAs(tableName, null, condition);
  }

  leftJoinCondAs(tableName, alias, condition) {
    this.joinCond('LEFT OUTER', tableName, alias, condition);
    return this;
  }

  rightJoin(tableName, leftKey, rightKey) {
    return this.rightJoinAs(tableName, null, leftKey, rightKey);
  }

  rightJoinAs(tableName, alias, leftKey, rightKey) {
    this.join('RIGHT OUTER', tableName, alias, leftKey, rightKey);
    return this;
  }

  rightJoinCond(tableName, condition) {
    return this.rightJoinCondAs(tableName, null, condition);
  }

  rightJoinCondAs(tableName, alias, condition) {
    this.joinCond('RIGHT OUTER', tableName, alias, condition);
    return this;
  }

  fullJoin(tableName, leftKey, rightKey) {
    return this.fullJoinAs(tableName, null, leftKey, rightKey);
  }

  fullJoinAs(tableName, alias, leftKey, rightKey) {
    this.join('FULL OUTER', tableName, alias, leftKey, rightKey);
    return this;
  }

  fullJoinCond(tableName, condition) {
    return this.fullJoinCondAs(tableName, null, condition);
  }

  fullJoinCondAs(tableName, alias, condition) {
    this.joinCond('FULL OUTER', tableName, alias, condition);
    return this;
  }

  naturalJoin(tableName) {
    return this.naturalJoinAs(tableName, null, null, null);
  }

  naturalJoinAs(tableName, alias) {
    this.join('NATURAL', tableName, alias, null, null);
    return this;
  }

  crossJoin(tableName) {
    return this.crossJoinAs(tableName, null, null, null);
  }

  crossJoinAs(tableName, alias) {
    this.join('CROSS', tableName, alias, null, null);
    return this;
  }

  join(kind, tableName, alias, leftKey, rightKey) {
    this.operations.join.push({
      kind,
      table: this.escapeIdentifier(tableName),
      alias: this.escapeIdentifier(alias),
      leftKey: this.escapeKey(leftKey),
      rightKey: this.escapeKey(rightKey),
    });
    return this;
  }

  joinCond(kind, tableName, alias, condition) {
    checkTypeOrQuery(condition, 'condition', 'string');
    this.operations.join.push({
      kind,
      table: this.escapeIdentifier(tableName),
      alias: this.escapeIdentifier(alias),
      condition,
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

  orderByRaw(raw) {
    checkTypeOrQuery(raw, 'order by raw', 'string');
    this.operations.orderBy.push({ raw });
    return this;
  }

  groupBy(...fields) {
    const groupBy = this.operations.groupBy;
    for (const f of fields) {
      groupBy.add(this.escapeKey(f));
    }
    return this;
  }

  groupByRaw(raw) {
    checkTypeOrQuery(raw, 'group by raw', 'string');
    this.operations.groupBy.add(raw);
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
    if (alias) alias = this.escapeIdentifier(alias);

    if (field instanceof QueryBuilder || typeof field === 'function') {
      this.operations.select.add({ type, sql: field, alias });
    } else {
      this.operations.select.add({ type, field: this.escapeKey(field), alias });
    }

    return this;
  }

  count(field = '*', alias) {
    return this._addSelectClause('count', field, alias);
  }

  countOver(field = '*', alias) {
    this.operations.select.add({
      type: 'count',
      sql: `COUNT(${this.escapeKey(field)}) OVER()`,
      alias: alias && this.escapeIdentifier(alias),
    });
    return this;
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

  // #private
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
        if (op.raw) {
          return typeof op.raw === 'string'
            ? op.raw
            : this._whereValueMapper(op.raw).build();
        }
        const alias = op.alias ? ` AS ${op.alias}` : '';
        if (op.sql) {
          const sql =
            typeof op.sql === 'string'
              ? op.sql
              : this._whereValueMapper(op.sql).build();
          return `(${sql})${alias}`;
        }
        if (op.type) {
          const handler = functionHandlers[op.type] ?? functionHandlers.default;
          return handler(op) + alias;
        }
        return op.field + alias;
      },
      ', '
    );
  }

  // #private
  _processJoin(joins) {
    let clauses = '';
    for (const join of joins) {
      const alias = join.alias ? ` AS ${join.alias}` : '';
      if (join.kind === 'NATURAL' || join.kind === 'CROSS') {
        clauses += ` ${join.kind} JOIN ${join.table}${alias}`;
      } else if (join.condition) {
        const condition =
          join.condition instanceof QueryBuilder
            ? join.condition.build()
            : join.condition;
        clauses += ` ${join.kind} JOIN ${join.table}${alias} ON ${condition}`;
      } else {
        clauses += ` ${join.kind} JOIN ${join.table}${alias} ON ${join.leftKey} = ${join.rightKey}`;
      }
    }
    return clauses;
  }

  // #private
  _processOrder(clauses) {
    return mapJoinIterable(
      clauses,
      (o) => {
        if (o.raw) {
          return typeof o.raw === 'string' ? o.raw : o.raw.build();
        }
        return `${o.field} ${o.dir}`;
      },
      ', '
    );
  }

  // #private
  _processGroupBy(clauses) {
    return mapJoinIterable(
      clauses,
      (g) => (typeof g === 'string' ? g : g.build()),
      ', '
    );
  }

  build() {
    let query = 'SELECT';

    if (this.operations.selectDistinct) query += ` ${this._processDistinct()}`;

    query += ' ' + this._processSelect(this.operations.select);

    if (this.operations.from.length === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += ` FROM ${this._processFrom(this.operations.from)}`;

    query += this._processJoin(this.operations.join);

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses}`;
    }

    if (this.operations.groupBy.size > 0) {
      query += ` GROUP BY ${this._processGroupBy(this.operations.groupBy)}`;
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
