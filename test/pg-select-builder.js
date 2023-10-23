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
