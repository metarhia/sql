'use strict';

const { QueryBuilder } = require('./query-builder.js');

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

module.exports = { RawBuilder };
