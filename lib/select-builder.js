'use strict';

const { iter } = require('@metarhia/common');

const { QueryBuilder } = require('./query-builder');

const allowedConditions = new Set(['=', '<>', '<', '<=', '>', '>=', 'LIKE']);

const supportedOps = {
  select: Set,
  innerJoin: Array,
  selectDistinct: null,
  count: Array,
  avg: Array,
  min: Array,
  max: Array,
  sum: Array,
  where: Array,
  groupBy: Set,
  orderBy: Set,
  from: Set,
  limit: null,
  offset: null,
};

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
    throw new TypeError(
      `Invalid '${name}' value (${value}) type, expected '${type}'`
    );
  }
};

const makeParamValue = (cond, value, params) => {
  if (value instanceof QueryBuilder) {
    return '(' + value.build(params) + ')';
  } else if (cond === 'IN' || cond === 'NOT IN') {
    return '(' + value.map(v => params.add(v)).join(', ') + ')';
  } else if (cond && cond.endsWith('ANY')) {
    return '(' + params.add(value) + ')';
  } else {
    return params.add(value);
  }
};

class SelectBuilder extends QueryBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = new Map();
    for (const op of Object.keys(supportedOps)) {
      const constructor = supportedOps[op];
      this.operations.set(op, constructor ? new constructor() : null);
    }
  }

  from(tableName) {
    this.operations.get('from').add(this.escapeIdentifier(tableName));
    return this;
  }

  select(...fields) {
    const select = this.operations.get('select');
    iter(fields)
      .map(this.escapeKey)
      .forEach(f => select.add(f));
    return this;
  }

  innerJoin(tableName, leftKey, rightKey) {
    this.operations.get('innerJoin').push({
      table: this.escapeIdentifier(tableName),
      leftKey: this.escapeKey(leftKey),
      rightKey: this.escapeKey(rightKey),
    });
    return this;
  }

  distinct() {
    this.operations.set('selectDistinct', true);
    return this;
  }

  where(key, cond, value) {
    cond = parseCondition(cond.toUpperCase());
    this.operations.get('where').push({
      key: this.escapeKey(key),
      value,
      cond,
    });
    return this;
  }

  whereNot(key, cond, value) {
    cond = parseCondition(cond.toUpperCase());
    this.operations.get('where').push({
      key: this.escapeKey(key),
      value,
      cond,
      mod: 'NOT',
    });
    return this;
  }

  whereNull(key) {
    this.operations.get('where').push({
      key: this.escapeKey(key),
      cond: 'IS',
      value: 'null',
    });
    return this;
  }

  whereNotNull(key) {
    this.operations.get('where').push({
      key: this.escapeKey(key),
      cond: 'IS',
      value: 'null',
      mod: 'NOT',
    });
    return this;
  }

  whereIn(key, conds) {
    this.operations.get('where').push({
      key: this.escapeKey(key),
      cond: 'IN',
      value: conds,
    });
    return this;
  }

  whereNotIn(key, conds) {
    this.operations.get('where').push({
      key: this.escapeKey(key),
      cond: 'NOT IN',
      value: conds,
    });
    return this;
  }

  whereAny(key, value) {
    this.operations.get('where').push({
      key: this.escapeKey(key),
      cond: '= ANY',
      value,
    });
    return this;
  }

  whereExists(subquery) {
    this.operations.get('where').push({
      cond: 'EXISTS',
      value: subquery,
    });
    return this;
  }

  orderBy(field, dir = 'ASC') {
    dir = dir.toUpperCase();
    this.operations.get('orderBy').add({ field: this.escapeKey(field), dir });
    return this;
  }

  groupBy(...fields) {
    const groupBy = this.operations.get('groupBy');
    iter(fields)
      .map(this.escapeKey)
      .forEach(f => groupBy.add(f));
    return this;
  }

  limit(limit) {
    checkType(limit, 'limit', 'number');
    this.operations.set('limit', limit);
    return this;
  }

  offset(offset) {
    checkType(offset, 'offset', 'number');
    this.operations.set('offset', offset);
    return this;
  }

  count(field = '*') {
    if (field !== '*') field = this.escapeKey(field);
    this.operations.get('count').push({ field });
    return this;
  }

  avg(field) {
    this.operations.get('avg').push({ field: this.escapeKey(field) });
    return this;
  }

  min(field) {
    this.operations.get('min').push({ field: this.escapeKey(field) });
    return this;
  }

  max(field) {
    this.operations.get('max').push({ field: this.escapeKey(field) });
    return this;
  }

  sum(field) {
    this.operations.get('sum').push({ field: this.escapeKey(field) });
    return this;
  }

  processSelect(query, fields) {
    if (fields.size === 0) return query + ' *';
    return query + ' ' + [...fields].join(', ');
  }

  processOperations(query, operations) {
    const fns = [];
    for (const fn of sqlFunctions) {
      const ops = operations.get(fn);
      if (ops.length === 0) continue;
      for (const op of ops) fns.push(`${fn}(${op.field})`);
    }
    if (fns.length === 0) return query;
    const sql = query.endsWith(' *') ? query.slice(0, -1) : query + ', ';
    return sql + fns.join(', ');
  }

  processWhere(query, clauses) {
    // TODO(lundibundi): support braces
    query += ' WHERE';
    for (let i = 0; i < clauses.length; ++i) {
      const clause = clauses[i];
      if (i !== 0) {
        if (clause.or) query += ' OR';
        else query += ' AND';
      }
      if (clause.mod) query += ` ${clause.mod}`;
      if (clause.key) query += ` ${clause.key}`;
      query +=
        ` ${clause.cond} ` +
        makeParamValue(clause.cond, clause.value, this.params);
    }
    return query;
  }

  processOrder(query, clauses) {
    const it = iter(clauses);
    const firstClause = it.next().value;
    query += ` ORDER BY ${firstClause.field} ${firstClause.dir}`;
    for (const order of it) {
      query += `, ${order.field} ${order.dir}`;
    }
    return query;
  }

  build() {
    let query = 'SELECT';

    if (this.operations.get('selectDistinct')) query += ' DISTINCT';

    query = this.processSelect(query, this.operations.get('select'));

    query = this.processOperations(query, this.operations);

    const tableNames = this.operations.get('from');
    if (tableNames.size === 0) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += ' FROM ' + iter(tableNames).join(', ');

    this.operations.get('innerJoin').forEach(({ table, leftKey, rightKey }) => {
      query += ` INNER JOIN ${table} ON ${leftKey} = ${rightKey}`;
    });

    const whereClauses = this.operations.get('where');
    if (whereClauses.length > 0) {
      query = this.processWhere(query, whereClauses, this.params);
    }

    const groupClauses = this.operations.get('groupBy');
    if (groupClauses.size > 0) {
      query += ' GROUP BY ' + iter(groupClauses).join(', ');
    }

    const orderClauses = this.operations.get('orderBy');
    if (orderClauses.size > 0) {
      query = this.processOrder(query, orderClauses);
    }

    const limit = this.operations.get('limit');
    if (limit) {
      query += ` LIMIT ${makeParamValue(null, limit, this.params)}`;
    }

    const offset = this.operations.get('offset');
    if (offset) {
      query += ` OFFSET ${makeParamValue(null, offset, this.params)}`;
    }

    return query;
  }
}

module.exports = { SelectBuilder };
