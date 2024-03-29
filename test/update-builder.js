'use strict';

const { testSync } = require('metatests');
const {
  PostgresParamsBuilder,
  SelectBuilder,
  UpdateBuilder,
} = require('../sql.js');

const test = testSync('UpdateBuilder tests', null, { parallelSubtests: true });

test.beforeEach(async () => {
  const params = new PostgresParamsBuilder();
  return { builder: new UpdateBuilder(params), params };
});

test.testSync('update all items', (test, { builder, params }) => {
  builder.table('Table').set('a', 42).set('b', 'aaa');

  test.strictSame(builder.build(), 'UPDATE "Table" SET "a" = $1, "b" = $2');
  test.strictSame(params.build(), [42, 'aaa']);
});

test.testSync('update all items wih alias', (test, { builder, params }) => {
  builder.table('Table', 't').set('a', 42).set('b', 'aaa');

  test.strictSame(
    builder.build(),
    'UPDATE "Table" AS "t" SET "a" = $1, "b" = $2'
  );
  test.strictSame(params.build(), [42, 'aaa']);
});

test.testSync('update with < condition', (test, { builder, params }) => {
  builder.table('Table').set('a', 'ff').where('b', '<', 42);

  test.strictSame(
    builder.build(),
    'UPDATE "Table" SET "a" = $1 WHERE "b" < $2'
  );
  test.strictSame(params.build(), ['ff', 42]);
});

test.testSync(
  'update with simple or condition',
  (test, { builder, params }) => {
    builder
      .table('Table')
      .whereEq('a', '42')
      .orWhere('b', '=', '24')
      .set('c', true);

    test.strictSame(
      builder.build(),
      'UPDATE "Table" SET "c" = $1 WHERE "a" = $2 OR "b" = $3'
    );
    test.strictSame(params.build(), [true, '42', '24']);
  }
);

test.testSync('update with null and condition', (test, { builder, params }) => {
  builder.table('Table').set('f1', 'gg').whereMore('a', 999).whereNull('b');

  test.strictSame(
    builder.build(),
    'UPDATE "Table" SET "f1" = $1 WHERE "a" > $2 AND "b" IS NULL'
  );
  test.strictSame(params.build(), ['gg', 999]);
});

test.testSync('stringify update object', (test, { builder, params }) => {
  const obj = { a: 'vv', b: true };
  const date = new Date();
  builder.table('Table').set('a', 42).set('b', obj).set('c', date);

  test.strictSame(
    builder.build(),
    'UPDATE "Table" SET "a" = $1, "b" = $2, "c" = $3'
  );
  test.strictSame(params.build(), [42, JSON.stringify(obj), date]);
});

test.testSync('update with query value', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42).limit(1);

  builder.table('Table').set('a', nestedQuery).set('b', false);

  test.strictSame(
    builder.build(),
    'UPDATE "Table" SET "a" = (SELECT "a" FROM "table2" WHERE "id" > $1 LIMIT $2), "b" = $3'
  );
  test.strictSame(params.build(), [42, 1, false]);
});

test.testSync('update with nested builder', (test, { builder, params }) => {
  builder
    .table('Table')
    .set('a', (b) => b.from('table2').select('a').where('id', '>', 42).limit(1))
    .set('b', false);

  test.strictSame(
    builder.build(),
    'UPDATE "Table" SET "a" = (SELECT "a" FROM "table2" WHERE "id" > $1 LIMIT $2), "b" = $3'
  );
  test.strictSame(params.build(), [42, 1, false]);
});

test.testSync(
  'update with from and conditions',
  (test, { builder, params }) => {
    builder
      .table('table1', 't1')
      .from('table2', 't2')
      .setKey('a', 't2.a')
      .setKey('b', 't2.b')
      .set('c', 42)
      .whereKey('t1.c', '=', 't2.c')
      .whereNotNull('t1.f');

    test.strictSame(
      builder.build(),
      'UPDATE "table1" AS "t1" SET "a" = "t2"."a", "b" = "t2"."b", "c" = $1 FROM "table2" AS "t2" WHERE "t1"."c" = "t2"."c" AND "t1"."f" IS NOT NULL'
    );
    test.strictSame(params.build(), [42]);
  }
);

test.testSync(
  'update multiple with nested builder',
  (test, { builder, params }) => {
    builder.table('Table').sets({
      a: (b) => b.from('table2').select('a').where('id', '>', 42).limit(1),
      b: false,
    });

    test.strictSame(
      builder.build(),
      'UPDATE "Table" SET "a" = (SELECT "a" FROM "table2" WHERE "id" > $1 LIMIT $2), "b" = $3'
    );
    test.strictSame(params.build(), [42, 1, false]);
  }
);

test.testSync('Update "with" clause', (test, { builder, params }) => {
  builder
    .with('sub', builder.select().from('table2').whereEq('a', 42))
    .table('Table')
    .sets({
      a: builder.key('sub.b'),
      b: false,
    })
    .from('sub');
  const query = builder.build();
  test.strictSame(
    query,
    'WITH "sub" AS (SELECT * FROM "table2" WHERE "a" = $1) UPDATE "Table" SET "a" = ("sub"."b"), "b" = $2 FROM "sub"'
  );
  test.strictSame(params.build(), [42, false]);
});

test.testSync('Update "with" clause fn', (test, { builder, params }) => {
  builder
    .with('sub', (b) => b.from('table2').whereEq('a', 42))
    .table('Table')
    .sets({
      a: builder.key('sub.b'),
      b: false,
    })
    .from('sub');
  const query = builder.build();
  test.strictSame(
    query,
    'WITH "sub" AS (SELECT * FROM "table2" WHERE "a" = $1) UPDATE "Table" SET "a" = ("sub"."b"), "b" = $2 FROM "sub"'
  );
  test.strictSame(params.build(), [42, false]);
});

test.testSync('Update returning', (test, { builder, params }) => {
  builder
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
    .returning('*');
  const query = builder.build();
  test.strictSame(
    query,
    `UPDATE "employees" SET "sales_count" = ("sales_count" + 1) WHERE "id" = (SELECT "sales_person" FROM "accounts" WHERE "name" = $1) RETURNING *`
  );
  test.strictSame(params.build(), ['Acme Corporation']);
});
