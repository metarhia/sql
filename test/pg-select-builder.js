'use strict';

const { testSync } = require('metatests');
const { PostgresParamsBuilder, PgSelectBuilder } = require('../sql.js');

const test = testSync('PgSelectBuilder tests', null, {
  parallelSubtests: true,
});

test.beforeEach(async () => {
  const params = new PostgresParamsBuilder();
  return { builder: new PgSelectBuilder(params), params };
});

test.testSync('select with distinct on', (test, { builder, params }) => {
  builder
    .from('table')
    .select('f1', 'f2', 'f3')
    .distinctOn('f1')
    .where('f2', '=', 3)
    .orderBy('f1')
    .orderBy('f4');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT DISTINCT ON ("f1") "f1", "f2", "f3" FROM "table" WHERE "f2" = $1 ORDER BY "f1" ASC, "f4" ASC'
  );
  test.strictSame(params.build(), [3]);
});

test.testSync('nested select must be PgSelectBuilder', (test, { builder }) => {
  const nested = builder.nested();
  test.type(nested, 'PgSelectBuilder');
});

test.testSync('must provide PgSelectBuilder in select', (test, { builder }) => {
  test.plan(1);
  builder.from('table1').select((b) => {
    test.type(b, 'PgSelectBuilder');
    return b.from('table2');
  });
  builder.build();
});

test.testSync('pg select with cast ::', (test, { builder, params }) => {
  builder
    .from('table')
    .select('f1::text')
    .selectAs('f2::int', 'ii')
    .where('f2', '=', 3)
    .whereILike('f3::text', 3);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "f1"::text, "f2"::int AS "ii" FROM "table" WHERE "f2" = $1 AND "f3"::text ILIKE $2'
  );
  test.strictSame(params.build(), [3, 3]);
});

test.testSync('Select with clause', (test, { builder, params }) => {
  builder
    .with(
      'sub',
      builder.nested().distinctOn('f').from('table2').whereEq('a', 42)
    )
    .from('table')
    .whereEq('f1', 3)
    .leftJoin('sub', 'b', 'f2');
  const query = builder.build();
  test.strictSame(
    query,
    'WITH "sub" AS (SELECT DISTINCT ON ("f") * FROM "table2" WHERE "a" = $1) SELECT * FROM "table" LEFT OUTER JOIN "sub" ON "b" = "f2" WHERE "f1" = $2'
  );
  test.strictSame(params.build(), [42, 3]);
});
