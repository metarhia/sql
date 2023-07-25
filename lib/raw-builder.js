'use strict';

const { QueryBuilder } = require('./query-builder.js');

class RawBuilder extends QueryBuilder {
  //   sqlTemplate <Function>
  //     params <ParamsBuilder>
  //   Returns: <string> query
  constructor(sqlTemplate, params, options) {
    super(params, options);
    this.sqlTemplate = sqlTemplate;
  }

  build() {
    return this.sqlTemplate(this.params);
  }
}

module.exports = { RawBuilder };
