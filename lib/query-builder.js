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

  makeKeyOrExpr(value) {
    return value instanceof QueryBuilder
      ? '(' + value.build() + ')'
      : this.escapeKey(value);
  }

  // Build and return the SQL query
  // Returns: <string>
  build() {
    throw new Error('Not implemented');
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
  makeParamValue,
  makeKeyWithAlias,
  checkTypeOrQuery,
};
