'use strict';

const { QueryBuilder } = require('./query-builder');
const { joinIterable, mapJoinIterable } = require('./utils');

const compareOperators = ['=', '<>', '<', '<=', '>', '>=', 'LIKE', 'EXISTS'];
const setOperators = ['IN', 'NOT IN'];
const operators = new Set([...compareOperators, ...setOperators]);

const functionHandlers = {
  count: op => `count(${op.field})`,
  avg: op => `avg(${op.field})`,
  min: op => `min(${op.field})`,
  max: op => `max(${op.field})`,
  sum: op => `sum(${op.field})`,
};

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
  if (value instanceof QueryBuilder) {
    return '(' + value.build(params) + ')';
  }
  if (op === 'IN' || op === 'NOT IN') {
    return '(' + mapJoinIterable(value, el => params.add(el), ', ') + ')';
  }
  if (op && op.endsWith('ANY')) {
    return '(' + params.add(value) + ')';
  }
  return params.add(value);
};

class SelectBuilder extends QueryBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      fields: new Set(),
      from: new Set(),
      distinct: false,
      joins: [],
      where: [],
      group: [],
      order: [],
      limit: NaN,
      offset: NaN,
    };
  }

  from(tableName) {
    this.operations.from.add(this.escapeIdentifier(tableName));
    return this;
  }

  select(...fields) {
    for (const name of fields) {
      this.operations.fields.add(this.escapeKey(name));
    }
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

  _where(field, operator, value, mod) {
    const op = parseOperator(operator.toUpperCase());
    const key = this.escapeKey(field);
    this.operations.where.push({ key, value, op, mod });
    return this;
  }

  where(field, cond, value) {
    return this._where(field, cond, value);
  }

  whereNot(field, op, value) {
    return this._where(field, op, value, 'NOT');
  }

  whereNull(field) {
    return this._where(field, 'IS', 'null');
  }

  whereNotNull(field) {
    return this._where(field, 'IS', 'null', 'NOT');
  }

  whereIn(field, values) {
    return this._where(field, 'IN', values);
  }

  whereNotIn(field, values) {
    return this._where(field, 'NOT IN', values);
  }

  whereAny(field, values) {
    this.operations.where.push({
      key: this.escapeKey(field),
      op: '= ANY',
      value: values,
    });
    return this;
  }

  whereExists(subquery) {
    this.operations.where.push({ op: 'EXISTS', value: subquery });
    return this;
  }

  orderBy(key, dir = 'ASC') {
    this.operations.order.push({
      field: this.escapeKey(key),
      desc: dir.toUpperCase() === 'DESC',
    });
    return this;
  }

  groupBy(...fields) {
    const group = this.operations.group;
    for (const field of fields) group.push(this.escapeKey(field));
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

  count(name = '*') {
    this.operations.fields.add({
      field: name === '*' ? name : this.escapeKey(name),
      fn: 'count',
    });
    return this;
  }

  avg(field) {
    this.operations.fields.add({ field: this.escapeKey(field), fn: 'avg' });
    return this;
  }

  min(field) {
    this.operations.fields.add({ field: this.escapeKey(field), fn: 'min' });
    return this;
  }

  max(field) {
    this.operations.fields.add({ field: this.escapeKey(field), fn: 'max' });
    return this;
  }

  sum(field) {
    this.operations.fields.add({ field: this.escapeKey(field), fn: 'sum' });
    return this;
  }

  buildFields(fields) {
    if (fields.size === 0) return '*';
    return mapJoinIterable(
      fields,
      f => (typeof f === 'string' ? f : functionHandlers[f.fn](f)),
      ', '
    );
  }

  buildDatasets(from) {
    return 'FROM ' + joinIterable(from, ', ');
  }

  buildJoins(joins) {
    return mapJoinIterable(
      joins,
      j => `${j.type} ${j.table} ON ${j.leftKey} = ${j.rightKey}`,
      ' '
    );
  }

  buildWhere(where) {
    let conditions = '';
    for (const { key, value, op, mod, or } of where) {
      if (conditions.length > 0) conditions += or ? ' OR ' : ' AND ';
      if (mod) conditions += mod + ' ';
      if (key) conditions += key + ' ';
      conditions += op;
      conditions += ' ' + makeParamValue(op, value, this.params);
    }
    return 'WHERE ' + conditions;
  }

  buildGroupBy(groupBy) {
    return 'GROUP BY ' + joinIterable(groupBy, ', ');
  }

  buildOrderBy(orders) {
    return (
      'ORDER BY ' +
      mapJoinIterable(orders, o => o.field + (o.desc ? ' DESC' : ''), ' ')
    );
  }

  build() {
    if (this.operations.from.length === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }

    let query = 'SELECT';
    if (this.operations.distinct) query += ' DISTINCT';
    query += ' ' + this.buildFields(this.operations.fields);
    query += ' ' + this.buildDatasets(this.operations.from);

    const { joins, where, group, order, limit, offset } = this.operations;
    if (joins.length > 0) query += ' ' + this.buildJoins(joins);
    if (where.length > 0) query += ' ' + this.buildWhere(where);
    if (group.length > 0) query += ' ' + this.buildGroupBy(group);
    if (order.length > 0) query += ' ' + this.buildOrderBy(order);
    if (!Number.isNaN(limit))
      query += ' LIMIT ' + makeParamValue(null, limit, this.params);
    if (!Number.isNaN(offset))
      query += ' OFFSET ' + makeParamValue(null, offset, this.params);
    return query;
  }
}

module.exports = { SelectBuilder };
