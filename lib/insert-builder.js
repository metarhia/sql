'use strict';

const { SelectBuilder } = require('./select-builder.js');
const { mapJoinIterable } = require('./utils.js');
const { makeKeyWithAlias, QueryBuilder } = require('./query-builder.js');

class InsertBuilder extends QueryBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      table: null,
      values: [],
    };
  }

  table(tableName, alias) {
    this.operations.table = {
      table: this.escapeIdentifier(tableName),
      alias: alias && this.escapeIdentifier(alias),
    };
    return this;
  }

  value(key, value) {
    this.operations.values.push({
      key: this.escapeIdentifier(key),
      value: this._valueMapper(value),
    });
    return this;
  }

  values(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        this.value(key, value);
      }
    }
  }

  // #private
  _valueMapper(subquery) {
    return typeof subquery === 'function'
      ? subquery(new SelectBuilder(this.params, this.options))
      : subquery;
  }

  // #private
  _processValues(items) {
    const keys = mapJoinIterable(items, (v) => v.key, ', ');
    const values = mapJoinIterable(
      items,
      (v) => this.makeParamValue(v.value),
      ', '
    );
    return `(${keys}) VALUES (${values})`;
  }

  build() {
    let query = 'INSERT INTO ';

    if (!this.operations.table) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += makeKeyWithAlias(this.operations.table);

    query += ` ${this._processValues(this.operations.values)}`;

    return query;
  }
}

module.exports = { InsertBuilder };
