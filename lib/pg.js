'use strict';

const { PostgresParamsBuilder } = require('./pg-params-builder.js');
const { UpdateBuilder } = require('./update-builder.js');
const { DeleteBuilder } = require('./delete-builder.js');
const { PgInsertBuilder } = require('./pg-insert-builder.js');
const { PgSelectBuilder } = require('./pg-select-builder.js');
const { pgEscapeIdentifier } = require('./utils.js');

const pgSelect = (options) => {
  const params = options?.params ?? new PostgresParamsBuilder();
  return new PgSelectBuilder(params, {
    escapeIdentifier: pgEscapeIdentifier,
    ...options,
  });
};

const pg = pgSelect;

const pgInsert = (options) => {
  const params = options?.params ?? new PostgresParamsBuilder();
  return new PgInsertBuilder(params, {
    escapeIdentifier: pgEscapeIdentifier,
    ...options,
  });
};

const pgUpdate = (options) => {
  const params = new PostgresParamsBuilder();
  return new UpdateBuilder(params, {
    escapeIdentifier: pgEscapeIdentifier,
    ...options,
  });
};

const pgDelete = (options) => {
  const params = new PostgresParamsBuilder();
  return new DeleteBuilder(params, {
    escapeIdentifier: pgEscapeIdentifier,
    ...options,
  });
};

const pgQuerySelect = (pg, handler) => {
  const builder = pgSelect();
  handler(builder, builder.params);
  return pg.query(builder.build(), builder.buildParams());
};

const pgQueryInsert = (pg, handler) => {
  const builder = pgInsert();
  handler(builder, builder.params);
  return pg.query(builder.build(), builder.buildParams());
};

const pgQueryUpdate = (pg, handler) => {
  const builder = pgUpdate();
  handler(builder, builder.params);
  return pg.query(builder.build(), builder.buildParams());
};

const pgQueryDelete = (pg, handler) => {
  const builder = pgDelete();
  handler(builder, builder.params);
  return pg.query(builder.build(), builder.buildParams());
};

module.exports = {
  pg,
  pgSelect,
  pgInsert,
  pgUpdate,
  pgDelete,
  pgQuerySelect,
  pgQueryInsert,
  pgQueryUpdate,
  pgQueryDelete,
};
