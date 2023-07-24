'use strict';

const { QueryConditionsBuilder } = require('./query-conditions-builder');
const { mapJoinIterable } = require('./utils');
const { SelectBuilder } = require('./select-builder');
const { makeParamValue } = require('./query-builder');

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

  set(key, value) {
    this.operations.set.push({
      column: this.escapeKey(key),
      value: this._whereValueMapper(value),
    });
  }

  from(tableName, alias) {
    const table = this.escapeIdentifier(tableName);
    this.operations.from.push({ table, alias: alias && this.escapeKey(alias) });
    return this;
  }

  _whereValueMapper(subquery) {
    return typeof subquery === 'function'
      ? subquery(new SelectBuilder(this.params, this.options))
      : subquery;
  }

  _processFrom(from) {
    return mapJoinIterable(
      from,
      f => (!f.alias ? String(f.table) : `${f.table} AS ${f.alias}`),
      ', '
    );
  }

  _processSet(set) {
    return mapJoinIterable(
      set,
      s => `${s.column} = ${makeParamValue(s.value, this.params)}`,
      ', '
    );
  }

  build() {
    let query = 'UPDATE';

    const table = this.operations.table;
    if (!table) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }

    query += !table.alias
      ? String(table.table)
      : `${table.table} AS ${table.alias}`;

    query += this._processSet(this.operations.set);

    const from = this.operations.from;
    if (from.length > 0) {
      query += `FROM ${this._processFrom(from)}`;
    }

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses;
    }

    return query;
  }
}

module.exports = { UpdateBuilder };
