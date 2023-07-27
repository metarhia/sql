'use strict';

const { testSync } = require('metatests');
const {
  PostgresParamsBuilder,
  PgInsertBuilder,
  RawBuilder,
} = require('../sql.js');

const test = testSync('PgInsertBuilder tests', null, {
  parallelSubtests: true,
});

test.beforeEach(async () => {
  const params = new PostgresParamsBuilder();
  return { builder: new PgInsertBuilder(params), params };
});

test.testSync(
  'insert multiple items with returning all',
  (test, { builder, params }) => {
    builder.table('Table').value('a', 42).value('b', 'aaa').returning('*');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ($1, $2) RETURNING *'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);

test.testSync(
  'insert multiple items with returning key',
  (test, { builder, params }) => {
    builder.table('Table').value('a', 42).value('b', 'aaa').returning('id');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ($1, $2) RETURNING "id"'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);

test.testSync(
  'insert multiple items with returning multiple keys',
  (test, { builder, params }) => {
    builder
      .table('Table')
      .value('a', 42)
      .value('b', 'aaa')
      .returning('id')
      .returning('f1')
      .returning('f2');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ($1, $2) RETURNING "id", "f1", "f2"'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);

test.testSync(
  'insert multiple items with returning key alias',
  (test, { builder, params }) => {
    builder
      .table('Table')
      .value('a', 42)
      .value('b', 'aaa')
      .returning('id', 'key');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ($1, $2) RETURNING "id" AS "key"'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);

test.testSync(
  'insert multiple items with returning builder alias',
  (test, { builder, params }) => {
    builder
      .table('Table')
      .value('a', 42)
      .value('b', 'aaa')
      .returning(new RawBuilder('"abc"'), 'key');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ($1, $2) RETURNING "abc" AS "key"'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);

test.testSync(
  'insert multiple items with returning all on conflict',
  (test, { builder, params }) => {
    builder
      .table('Table')
      .value('a', 42)
      .value('b', 'aaa')
      .conflict('("f1", "f2")', 'DO NOTHING')
      .returning('*');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ($1, $2) ON CONFLICT ("f1", "f2") DO NOTHING RETURNING *'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);
