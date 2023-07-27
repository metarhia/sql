'use strict';

const { PostgresParamsBuilder } = require('./pg-params-builder.js');
const { UpdateBuilder } = require('./update-builder.js');
const { DeleteBuilder } = require('./delete-builder.js');
const { PgInsertBuilder } = require('./pg-insert-builder.js');
const { PgSelectBuilder } = require('./pg-select-builder.js');

const pgSelect = (handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new PgSelectBuilder(params);
  if (handler) handler(builder, params);
  return builder;
};

const pg = pgSelect;

const pgInsert = (handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new PgInsertBuilder(params);
  if (handler) handler(builder, params);
  return builder;
};

const pgUpdate = (handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new UpdateBuilder(params);
  if (handler) handler(builder, params);
  return builder;
};

const pgDelete = (handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new DeleteBuilder(params);
  if (handler) handler(builder, params);
  return builder;
};

const pgQuerySelect = (pg, handler) => {
  const builder = pgSelect(handler);
  return pg.query(builder.build(), builder.buildParams());
};

const pgQueryInsert = (pg, handler) => {
  const builder = pgInsert(handler);
  return pg.query(builder.build(), builder.buildParams());
};

const pgQueryUpdate = (pg, handler) => {
  const builder = pgUpdate(handler);
  return pg.query(builder.build(), builder.buildParams());
};

const pgQueryDelete = (pg, handler) => {
  const builder = pgDelete(handler);
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
