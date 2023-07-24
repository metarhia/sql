'use strict';

const { QueryConditionsBuilder } = require('./query-conditions-builder');
const { SelectBuilder } = require('./select-builder');

class DeleteBuilder extends QueryConditionsBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      from: null,
    };
  }

  from(tableName, alias) {
    const table = this.escapeIdentifier(tableName);
    this.operations.from = { table, alias: alias && this.escapeKey(alias) };
    return this;
  }

  _whereValueMapper(subquery) {
    return typeof subquery === 'function'
      ? subquery(new SelectBuilder(this.params, this.options))
      : subquery;
  }

  build() {
    let query = 'DELETE';

    const from = this.operations.from;
    if (!from) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += String(from.table) + (from.alias ? `AS ${from.alias}` : '');

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses;
    }

    return query;
  }
}

module.exports = { DeleteBuilder };
