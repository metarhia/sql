'use strict';

const { QueryConditionsBuilder } = require('./query-conditions-builder.js');
const { selectSubqueryBuilder } = require('./select-builder.js');
const { makeKeyWithAlias } = require('./query-builder.js');

class DeleteBuilder extends QueryConditionsBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = { from: null };
  }

  from(tableName, alias) {
    this.operations.from = {
      table: this.escapeIdentifier(tableName),
      alias: alias && this.escapeIdentifier(alias),
    };
    return this;
  }

  // #private
  _whereValueMapper(subquery) {
    return selectSubqueryBuilder(subquery, this);
  }

  build() {
    let query = 'DELETE FROM ';

    if (!this.operations.from) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += makeKeyWithAlias(this.operations.from);

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses}`;
    }

    return query;
  }
}

module.exports = { DeleteBuilder };
