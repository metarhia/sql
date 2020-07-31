'use strict';

const { QueryBuilder } = require('./query-builder');

const compareOperators = ['=', '<>', '<', '<=', '>', '>=', 'LIKE'];
const setOperators = ['= ANY', 'IN', 'NOT IN'];
const operators = new Set([...compareOperators, ...setOperators]);

const sqlFunctions = ['count', 'avg', 'min', 'max', 'sum'];

const parseOperator = op => {
  if (op === '!=') return '<>';
  if (!operators.has(op)) {
    throw new Error(`The operator "${op}" is not permitted`);
  }
  return op;
};

const checkType = (value, name, type) => {
  if (!(value instanceof QueryBuilder) && typeof value !== type) {
    const msg = `Invalid '${name}' value (${value}) type, expected '${type}'`;
    throw new TypeError(msg);
  }
};

const makeParamValue = (op, value, params) => {
  if (value instanceof QueryBuilder) return '(' + value.build(params) + ')';
  if (op === 'IN' || op === 'NOT IN') {
    let par = '';
    for (const el of value) {
      if (par.length > 0) par += ', ';
      par += params.add(el);
    }
    return '(' + par + ')';
  }
  const par = params.add(value);
  if (op && op.endsWith('ANY')) return '(' + par + ')';
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

  _where(field, operator, value, not) {
    const op = parseOperator(operator.toUpperCase());
    const key = this.escapeKey(field);
    const mod = typeof not === 'string' ? not : undefined;
    this.operations.where.push({ key, value, op, mod });
    return this;
  }

  where(field, cond, value) {
    this._where(field, cond, value);
    return this;
  }

  whereNot(field, op, value) {
    this._where(field, op, value, 'NOT');
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
    this.operations.where.push({ op: 'EXISTS', value: subquery });
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

  buildFields(fields) {
    let names = '';
    for (const name of fields) {
      if (names.length > 0) names += ', ';
      names += name;
    }
    for (const fn of sqlFunctions) {
      const ops = this.operations[fn];
      if (ops.length === 0) continue;
      for (const { field } of ops) {
        if (names.length > 0) names += ', ';
        names += `${fn}(${field})`;
      }
    }
    return names.length > 0 ? names : '*';
  }

  buildDatasets(from) {
    let datasets = '';
    for (let i = 0; i < from.length; i++) {
      if (i > 0) datasets += ', ';
      datasets += from[i];
    }
    return datasets;
  }

  buildJoins(joins) {
    let conditions = '';
    for (const { type, table, leftKey, rightKey } of joins) {
      if (conditions.length > 0) conditions += ' ';
      conditions += `${type} ${table} ON ${leftKey} = ${rightKey}`;
    }
    return conditions;
  }

  buildWhere(where) {
    let conditions = '';
    for (const { key, value, op, mod, or } of where) {
      if (conditions.length > 0) conditions += or ? ' OR' : ' AND ';
      if (mod) conditions += mod + ' ';
      if (key) conditions += key + ' ';
      conditions += op;
      conditions += ' ' + makeParamValue(op, value, this.params);
    }
    return conditions;
  }

  buildGroup(group) {
    let groups = '';
    for (const name of group) {
      if (groups.length > 0) groups += ', ';
      groups += name;
    }
    return groups;
  }

  buildOrder() {
    let fields = '';
    for (const { field, desc } of this.operations.order) {
      if (fields.length > 0) fields += ' ';
      fields += field + (desc ? ' DESC' : '');
    }
    return fields;
  }

  build() {
    const { fields, joins, distinct, where } = this.operations;
    const { group, order, from, limit, offset } = this.operations;

    if (from.length === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }

    let query = 'SELECT';
    if (distinct) query += ' DISTINCT';
    query += ' ' + this.buildFields(fields);
    query += ' FROM ' + this.buildDatasets(from);
    if (joins.length > 0) query += ' ' + this.buildJoins(joins);
    if (where.length > 0) query += ' WHERE ' + this.buildWhere(where);
    if (group.length > 0) query += ' GROUP BY ' + this.buildGroup(group);
    if (order.length > 0) query += ' ORDER BY ' + this.buildOrder(order);
    if (limit) query += ' LIMIT ' + makeParamValue(null, limit, this.params);
    if (offset) query += ' OFFSET ' + makeParamValue(null, offset, this.params);
    return query;
  }
}

module.exports = { SelectBuilder };
