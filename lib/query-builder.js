'use strict';

const {
  escapeIdentifier: defaultEscapeIdentifier,
  escapeKey,
} = require('./utils');

class QueryBuilder {
  //   params <ParamsBuilder>
  //   options <Object>
  //     escapeIdentifier <Function>
  //       identifier <string> to escape
  //     Returns: <string> escaped string
  constructor(params, { escapeIdentifier = defaultEscapeIdentifier } = {}) {
    this.params = params;
    this.escapeIdentifier = escapeIdentifier;
    this.escapeKey = key => escapeKey(key, this.escapeIdentifier);
  }

  // Build and return the SQL query
  // Returns: <string>
  build() {
    throw new Error('Not implemented');
  }
}

module.exports = { QueryBuilder };
