'use strict';

const {
  SelectBuilder,
  processWith,
  selectSubqueryBuilder,
} = require('./select-builder.js');
const { mapJoinIterable } = require('./utils.js');
const { makeKeyWithAlias, QueryBuilder } = require('./query-builder.js');

class InsertBuilder extends QueryBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      table: null,
      values: [],
      with: [],
      from: null,
    };
  }

  table(tableName, alias) {
    this.operations.table = {
      table: this.escapeIdentifier(tableName),
      alias: alias && this.escapeIdentifier(alias),
    };
    return this;
  }

  with(alias, sql) {
    this.operations.with.push({ sql, alias: this.makeKeyOrExpr(alias) });
    return this;
  }

  from(sql) {
    if (this.operations.values.length > 0) {
      throw new Error('Cannot use query insert with values');
    }
    this.operations.from = sql;
  }

  select() {
    return new SelectBuilder(this.params, this.options);
  }

  value(key, value) {
    if (this.operations.from) {
      throw new Error('Cannot use value with query insert');
    }
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
    return this;
  }

  // #private
  _valueMapper(subquery) {
    return selectSubqueryBuilder(subquery, this);
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
    let query = '';

    if (this.operations.with.length > 0) {
      query +=
        processWith(this.operations.with, this._valueMapper.bind(this)) + ' ';
    }

    query += 'INSERT INTO ';

    if (!this.operations.table) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }
    query += makeKeyWithAlias(this.operations.table);

    if (this.operations.from) {
      const builder = selectSubqueryBuilder(this.operations.from, this);
      const sql = builder instanceof QueryBuilder ? builder.build() : builder;
      query += ` ${sql}`;
    } else {
      query += ` ${this._processValues(this.operations.values)}`;
    }

    return query;
  }
}

module.exports = { InsertBuilder };
