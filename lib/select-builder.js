'use strict';

const { QueryBuilder } = require('./query-builder');

const allowedCompare = ['=', '<>', '<', '<=', '>', '>=', 'LIKE'];
const allowedOperators = ['= ANY', 'IN', 'NOT IN'];
const allowedConditions = new Set([...allowedCompare, ...allowedOperators]);

const sqlFunctions = ['count', 'avg', 'min', 'max', 'sum'];

const parseCondition = cond => {
  if (cond === '!=') return '<>';
  if (!allowedConditions.has(cond)) {
    throw new Error(`The operator "${cond}" is not permitted`);
  }
  return cond;
};

const checkType = (value, name, type) => {
  if (!(value instanceof QueryBuilder) && typeof value !== type) {
    const msg = `Invalid '${name}' value (${value}) type, expected '${type}'`;
    throw new TypeError(msg);
  }
};

const makeParamValue = (cond, value, params) => {
  if (value instanceof QueryBuilder) return '(' + value.build(params) + ')';
  if (cond === 'IN' || cond === 'NOT IN') {
    return '(' + value.map(v => params.add(v)).join(', ') + ')';
  }
  const par = params.add(value);
  if (cond && cond.endsWith('ANY')) return '(' + par + ')';
  return par;
};

class SelectBuilder extends QueryBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      fields: [],
      joins: [],
      distinct: false,
      count: [],
      avg: [],
      min: [],
      max: [],
      sum: [],
      where: [],
      group: [],
      order: [],
      from: [],
      limit: NaN,
      offset: NaN,
    };
  }

  from(tableName) {
    const { from } = this.operations;
    const name = this.escapeIdentifier(tableName);
    if (!from.includes(name)) from.push(name);
    return this;
  }

  select(...fields) {
    this.operations.fields.push(...fields.map(this.escapeKey));
    return this;
  }

  innerJoin(tableName, leftKey, rightKey) {
    this.operations.joins.push({
      type: 'INNER JOIN',
      table: this.escapeIdentifier(tableName),
      leftKey: this.escapeKey(leftKey),
      rightKey: this.escapeKey(rightKey),
    });
    return this;
  }

  distinct() {
    this.operations.distinct = true;
    return this;
  }

  _where(field, condition, value, neg) {
    const cond = parseCondition(condition.toUpperCase());
    const key = this.escapeKey(field);
    const mod = typeof neg === 'string' ? neg : undefined;
    this.operations.where.push({ key, value, cond, mod });
    return this;
  }

  where(field, cond, value) {
    this._where(field, cond, value);
    return this;
  }

  whereNot(field, cond, value) {
    this._where(field, cond, value, 'NOT');
    return this;
  }

  whereNull(field) {
    this._where(field, 'IS', 'null');
    return this;
  }

  whereNotNull(field) {
    this._where(field, 'IS', 'null', 'NOT');
    return this;
  }

  whereIn(field, values) {
    this._where(field, 'IN', values);
    return this;
  }

  whereNotIn(field, values) {
    this._where(field, 'NOT IN', values);
    return this;
  }

  whereAny(field, values) {
    this._where(field, '= ANY', values);
    return this;
  }

  whereExists(subquery) {
    this.operations.where.push({ cond: 'EXISTS', value: subquery });
    return this;
  }

  orderBy(key, dir = 'ASC') {
    const desc = dir.toUpperCase() === 'DESC';
    const field = this.escapeKey(key);
    this.operations.order.push({ field, desc });
    return this;
  }

  groupBy(...fields) {
    const keys = fields.map(this.escapeKey);
    this.operations.group.push(...keys);
    return this;
  }

  limit(limit) {
    checkType(limit, 'limit', 'number');
    this.operations.limit = limit;
    return this;
  }

  offset(offset) {
    checkType(offset, 'offset', 'number');
    this.operations.offset = offset;
    return this;
  }

  count(field = '*') {
    if (field !== '*') field = this.escapeKey(field);
    this.operations.count.push({ field });
    return this;
  }

  avg(field) {
    this.operations.avg.push({ field: this.escapeKey(field) });
    return this;
  }

  min(field) {
    this.operations.min.push({ field: this.escapeKey(field) });
    return this;
  }

  max(field) {
    this.operations.max.push({ field: this.escapeKey(field) });
    return this;
  }

  sum(field) {
    this.operations.sum.push({ field: this.escapeKey(field) });
    return this;
  }

  processFields(query) {
    const { fields } = this.operations;
    if (fields.length === 0) return query + ' *';
    return query + ' ' + fields.join(', ');
  }

  processOperations(query) {
    const fns = [];
    for (const fn of sqlFunctions) {
      const ops = this.operations[fn];
      if (ops.length === 0) continue;
      for (const op of ops) fns.push(`${fn}(${op.field})`);
    }
    if (fns.length === 0) return query;
    const sql = query.endsWith(' *') ? query.slice(0, -1) : query + ', ';
    return sql + fns.join(', ');
  }

  processWhere(query) {
    // TODO(lundibundi): support braces
    const { where } = this.operations;
    const expr = ['WHERE'];
    for (const { cond, value, mod, key, or } of where) {
      if (expr.length > 1) expr.push(or ? 'OR' : 'AND');
      if (mod) expr.push(mod);
      if (key) expr.push(key);
      expr.push(cond);
      const par = makeParamValue(cond, value, this.params);
      expr.push(par);
    }
    return query + ' ' + expr.join(' ');
  }

  processOrder(query) {
    const fields = [];
    for (const { field, desc } of this.operations.order) {
      if (desc) fields.push(`${field} DESC`);
      else fields.push(field);
    }
    return query + ' ORDER BY ' + fields.join(', ');
  }

  build() {
    let query = 'SELECT';
    if (this.operations.distinct) query += ' DISTINCT';
    query = this.processFields(query);
    query = this.processOperations(query);
    const { where, group, order, limit, offset, from } = this.operations;
    if (from.length === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += ' FROM ' + from.join(', ');
    this.operations.joins.forEach(({ type, table, leftKey, rightKey }) => {
      query += ` ${type} ${table} ON ${leftKey} = ${rightKey}`;
    });
    if (where.length > 0) query = this.processWhere(query);
    if (group.length > 0) query += ' GROUP BY ' + group.join(', ');
    if (order.length > 0) query = this.processOrder(query);
    if (limit) query += ` LIMIT ${makeParamValue(null, limit, this.params)}`;
    if (offset) query += ` OFFSET ${makeParamValue(null, offset, this.params)}`;
    return query;
  }
}

module.exports = { SelectBuilder };
