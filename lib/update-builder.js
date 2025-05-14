'use strict';

const { QueryConditionsBuilder } = require('./query-conditions-builder.js');
const {
  SelectBuilder,
  selectSubqueryBuilder,
  processWith,
} = require('./select-builder.js');
const { makeKeyWithAlias } = require('./query-builder.js');
const { mapJoinIterable } = require('./utils.js');
const { buildSqlOrBuilder } = require('./select-builder');

class UpdateBuilder extends QueryConditionsBuilder {
  constructor(params, options) {
    super(params, options);
    this.operations = {
      table: null,
      from: [],
      fromSelect: null,
      set: [],
      with: [],
      returning: [],
    };
  }

  select() {
    return new SelectBuilder(this.params, this.options);
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

  fromSelect(sql, alias) {
    this.operations.fromSelect = {
      sql: selectSubqueryBuilder(sql, this),
      alias: alias && this.escapeIdentifier(alias),
    };
    return this;
  }

  with(alias, sql) {
    this.operations.with.push({ sql, alias: this.makeKeyOrExpr(alias) });
    return this;
  }

  returning(key, alias) {
    this.operations.returning.push({
      key,
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

  sets(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        this.set(key, value);
      }
    }
    return this;
  }

  setKey(column, key) {
    this.operations.set.push({
      column: this.escapeKey(column),
      key: this.escapeKey(key),
    });
    return this;
  }

  isNotEmpty() {
    return this.operations.set.length > 0;
  }

  // #private
  _whereValueMapper(subquery) {
    return selectSubqueryBuilder(subquery, this);
  }

  // #private
  _processFrom(fromSelect, from) {
    if (fromSelect) {
      const sql = buildSqlOrBuilder(
        fromSelect.sql,
        this._whereValueMapper.bind(this)
      );
      return fromSelect.alias ? `${sql} AS ${fromSelect.alias}` : `${sql}`;
    }
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

  // #private
  _processReturning(returning) {
    if (returning[0]?.key === '*') return '*';
    return mapJoinIterable(
      returning,
      (r) => this.makeKeyOrExpr(r.key) + (r.alias ? ` AS ${r.alias}` : ''),
      ', '
    );
  }

  build() {
    let query = '';

    if (this.operations.with.length > 0) {
      query +=
        processWith(this.operations.with, this._whereValueMapper.bind(this)) +
        ' ';
    }

    query += 'UPDATE ';

    if (!this.operations.table) {
      throw new Error('Cannot generate SQL, tableName is not defined');
    }

    query += makeKeyWithAlias(this.operations.table);

    query += ` SET ${this._processSet(this.operations.set)}`;

    if (this.operations.fromSelect || this.operations.from?.length > 0) {
      query += ` FROM ${this._processFrom(
        this.operations.fromSelect,
        this.operations.from
      )}`;
    }

    const whereClauses = this.whereConditions.build();
    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses}`;
    }

    const { returning } = this.operations;
    if (returning?.length > 0) {
      query += ` RETURNING ${this._processReturning(returning)}`;
    }

    return query;
  }
}

module.exports = { UpdateBuilder };
