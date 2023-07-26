'use strict';

const { QueryConditionsBuilder } = require('./query-conditions-builder.js');
const { selectSubqueryBuilder } = require('./select-builder.js');
const { makeKeyWithAlias } = require('./query-builder.js');
const { mapJoinIterable } = require('./utils.js');

class UpdateBuilder extends QueryConditionsBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      table: null,
      from: [],
      set: [],
    };
  }

  table(tableName, alias) {
    const table = this.escapeIdentifier(tableName);
    this.operations.table = { table, alias: alias && this.escapeKey(alias) };
    return this;
  }

  from(tableName, alias) {
    this.operations.from.push({
      table: this.escapeIdentifier(tableName),
      alias: alias && this.escapeIdentifier(alias),
    });
    return this;
  }

  set(column, value) {
    this.operations.set.push({
      column: this.escapeKey(column),
      value: this._whereValueMapper(value),
    });
    return this;
  }

  setKey(column, key) {
    this.operations.set.push({
      column: this.escapeKey(column),
      key: this.escapeKey(key),
    });
    return this;
  }

  // #private
  _whereValueMapper(subquery) {
    return selectSubqueryBuilder(subquery, this);
  }

  // #private
  _processFrom(from) {
    return mapJoinIterable(from, makeKeyWithAlias, ', ');
  }

  // #private
  _processSet(set) {
    return mapJoinIterable(
      set,
      (s) => `${s.column} = ${s.key ? s.key : this.makeParamValue(s.value)}`,
      ', '
    );
  }

  build() {
    let query = 'UPDATE ';

    if (!this.operations.table) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }

    query += makeKeyWithAlias(this.operations.table);

    query += ` SET ${this._processSet(this.operations.set)}`;

    if (this.operations.from.length > 0) {
      query += ` FROM ${this._processFrom(this.operations.from)}`;
    }

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses}`;
    }

    return query;
  }
}

module.exports = { UpdateBuilder };
