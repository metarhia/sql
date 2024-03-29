'use strict';

const { pgEscapeIdentifier, mapJoinIterable } = require('./utils.js');
const { InsertBuilder } = require('./insert-builder.js');

class PgInsertBuilder extends InsertBuilder {
  constructor(params, options) {
    super(params, { escapeIdentifier: pgEscapeIdentifier, ...options });
    this.operations = {
      ...this.operations,
      returning: [],
      conflict: null,
    };
  }

  returning(key, alias) {
    this.operations.returning.push({
      key,
      alias: alias && this.escapeIdentifier(alias),
    });
    return this;
  }

  conflict(target, action) {
    this.operations.conflict = { target, action };
    return this;
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
    let query = super.build();

    const { conflict } = this.operations;
    if (conflict) {
      query += ` ON CONFLICT ${conflict.target ?? ''} ${conflict.action}`;
    }

    const { returning } = this.operations;
    if (returning?.length > 0) {
      query += ` RETURNING ${this._processReturning(returning)}`;
    }

    return query;
  }
}

module.exports = { PgInsertBuilder };
