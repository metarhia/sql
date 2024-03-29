'use strict';

const { testSync } = require('metatests');
const {
  PostgresParamsBuilder,
  SelectBuilder,
  InsertBuilder,
} = require('../sql.js');
const { UpdateBuilder } = require('../lib/update-builder.js');

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

test.testSync(
  'insert multiple with nested builder',
  (test, { builder, params }) => {
    builder.table('Table').values({
      a: (b) => b.from('table2').select('a').where('id', '>', 42).limit(1),
      b: false,
    });

    test.strictSame(
      builder.build(),
      'INSERT INTO "Table" ("a", "b") VALUES ((SELECT "a" FROM "table2" WHERE "id" > $1 LIMIT $2), $3)'
    );
    test.strictSame(params.build(), [42, 1, false]);
  }
);

test.testSync('insert with from nested update', (test, { builder, params }) => {
  builder
    .with(
      'upd',
      new UpdateBuilder(builder.params)
        .table('employees')
        .set('sales_count', builder.raw('"sales_count" + 1'))
        .whereEq(
          'id',
          builder
            .select()
            .from('accounts')
            .select('sales_person')
            .whereEq('name', 'Acme Corporation')
        )
        .returning('*')
    )
    .table('employees_log')
    .from(
      builder.select().from('upd').select('*').selectRaw('current_timestamp')
    );

  test.strictSame(
    builder.build(),
    `WITH "upd" AS (UPDATE "employees" SET "sales_count" = ("sales_count" + 1) WHERE "id" = (SELECT "sales_person" FROM "accounts" WHERE "name" = $1) RETURNING *) INSERT INTO "employees_log" SELECT *, current_timestamp FROM "upd"`
  );
  test.strictSame(params.build(), ['Acme Corporation']);
});
