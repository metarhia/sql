'use strict';

const { testSync } = require('metatests');
const {
  PostgresParamsBuilder,
  SelectBuilder,
  InsertBuilder,
} = require('../sql.js');

const test = testSync('InsertBuilder tests', null, { parallelSubtests: true });

test.beforeEach(async () => {
  const params = new PostgresParamsBuilder();
  return { builder: new InsertBuilder(params), params };
});

test.testSync('insert multiple items', (test, { builder, params }) => {
  builder.table('Table').value('a', 42).value('b', 'aaa');

  test.strictSame(
    builder.build(),
    'INSERT INTO "Table" ("a", "b") VALUES ($1, $2)'
  );
  test.strictSame(params.build(), [42, 'aaa']);
});

test.testSync(
  'insert multiple items wih alias',
  (test, { builder, params }) => {
    builder.table('Table', 't').value('a', 42).value('b', 'aaa');

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" AS "t" ("a", "b") VALUES ($1, $2)'
    );
    test.strictSame(params.build(), [42, 'aaa']);
  }
);

test.testSync('stringify insert object', (test, { builder, params }) => {
  const obj = { a: 'vv', b: true };
  const date = new Date();
  builder.table('Table').value('a', 42).value('b', obj).value('c', date);

  test.strictSame(
    builder.build(),
    'INSERT INTO "Table" ("a", "b", "c") VALUES ($1, $2, $3)'
  );
  test.strictSame(params.build(), [42, JSON.stringify(obj), date]);
});

test.testSync('insert with query value', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42).limit(1);

  builder.table('Table').value('a', nestedQuery).value('b', false);

  test.strictSame(
    builder.build(),
    'INSERT INTO "Table" ("a", "b") VALUES ((SELECT "a" FROM "table2" WHERE "id" > $1 LIMIT $2), $3)'
  );
  test.strictSame(params.build(), [42, 1, false]);
});

test.testSync('insert with nested builder', (test, { builder, params }) => {
  builder
    .table('Table')
    .value('a', (b) =>
      b.from('table2').select('a').where('id', '>', 42).limit(1)
    )
    .value('b', false);

  test.strictSame(
    builder.build(),
    'INSERT INTO "Table" ("a", "b") VALUES ((SELECT "a" FROM "table2" WHERE "id" > $1 LIMIT $2), $3)'
  );
  test.strictSame(params.build(), [42, 1, false]);
});
