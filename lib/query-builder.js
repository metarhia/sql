'use strict';

const {
  escapeIdentifier: defaultEscapeIdentifier,
  escapeKey,
} = require('./utils.js');

class QueryBuilder {
  //   params <ParamsBuilder>
  //   options <Object>
  //     escapeIdentifier <Function>
  //       identifier <string> to escape
  //     Returns: <string> escaped string
  constructor(params, options = {}) {
    this.params = params;
    this.options = options;
    this.escapeIdentifier = options.escapeIdentifier || defaultEscapeIdentifier;
    this.escapeKey = (key) => escapeKey(key, this.escapeIdentifier);
  }

  makeParamValue(value) {
    return makeParamValue(value, this.params);
  }

  makeKeyOrExpr(value, wrap = false) {
    if (value instanceof QueryBuilder) {
      return wrap ? `(${value.build()})` : value.build();
    }
    return this.escapeKey(value);
  }

  raw(sqlTemplate) {
    // eslint-disable-next-line no-use-before-define
    return new RawBuilder(sqlTemplate, this.params, this.options);
  }

  nested() {
    return new this.constructor(this.params, this.options);
  }

  // Build and return the SQL query
  // Returns: <string>
  build() {
    throw new Error('Not implemented');
  }

  // Build params for this query
  // Returns: <Array<unknown>>
  buildParams() {
    return this.params.build();
  }
}

class RawBuilder extends QueryBuilder {
  //   sqlTemplate <Function> function or sql string
  //     params <ParamsBuilder>
  //   Returns: <string> query
  constructor(sqlTemplate, params, options) {
    super(params, options);
    this.sqlTemplate = sqlTemplate;
  }

  build() {
    return typeof this.sqlTemplate === 'function'
      ? this.sqlTemplate(this.params)
      : this.sqlTemplate;
  }
}

function makeParamValue(value, params) {
  if (value instanceof QueryBuilder) {
    return '(' + value.build() + ')';
  }
  // Stringify plain objects for db.
  if (Object.prototype.toString.call(value) === '[object Object]') {
    return params.add(JSON.stringify(value));
  }
  return params.add(value);
}

function makeKeyWithAlias(table) {
  return !table.alias
    ? String(table.table)
    : `${table.table} AS ${table.alias}`;
}

function checkTypeOrQuery(value, name, type) {
  if (!(value instanceof QueryBuilder) && typeof value !== type) {
    throw new TypeError(
      `Invalid '${name}' value type, expected type ${type} or QueryBuilder. ` +
        `Received: ${value}`
    );
  }
}

module.exports = {
  QueryBuilder,
  RawBuilder,
  makeParamValue,
  makeKeyWithAlias,
  checkTypeOrQuery,
};
