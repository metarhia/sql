'use strict';

const { PostgresParamsBuilder } = require('./pg-params-builder.js');
const { SelectBuilder } = require('./select-builder.js');
const { UpdateBuilder } = require('./update-builder.js');
const { DeleteBuilder } = require('./delete-builder.js');
const { PgInsertBuilder } = require('./pg-insert-builder.js');

const pg = (handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new SelectBuilder(params);
  if (handler) handler(builder, params);
  return { builder, params };
};

const pgQuerySelect = (pg, handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new SelectBuilder(params);
  handler(builder, params);
  return pg.query(builder.build(), params.build());
};

const pgQueryInsert = (pg, handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new PgInsertBuilder(params);
  handler(builder, params);
  return pg.query(builder.build(), params.build());
};

const pgQueryUpdate = (pg, handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new UpdateBuilder(params);
  handler(builder, params);
  return pg.query(builder.build(), params.build());
};

const pgQueryDelete = (pg, handler) => {
  const params = new PostgresParamsBuilder();
  const builder = new DeleteBuilder(params);
  handler(builder, params);
  return pg.query(builder.build(), params.build());
};

module.exports = {
  pg,
  pgQuerySelect,
  pgQueryInsert,
  pgQueryUpdate,
  pgQueryDelete,
};
