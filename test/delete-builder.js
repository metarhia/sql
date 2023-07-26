'use strict';

const { testSync } = require('metatests');
const { PostgresParamsBuilder } = require('../lib/pg-params-builder');
const { DeleteBuilder } = require('../sql.js');
const { SelectBuilder } = require('../lib/select-builder.js');

const test = testSync('DeleteBuilder tests', null, { parallelSubtests: true });

test.beforeEach(async () => {
  const params = new PostgresParamsBuilder();
  return { builder: new DeleteBuilder(params), params };
});

test.testSync('delete all items', (test, { builder, params }) => {
  builder.from('Table');

  test.strictSame(builder.build(), 'DELETE FROM "Table"');
  test.strictSame(params.build(), []);
});

test.testSync('delete all items with alias', (test, { builder, params }) => {
  builder.from('Table', 'Alias');

  test.strictSame(builder.build(), 'DELETE FROM "Table" AS "Alias"');
  test.strictSame(params.build(), []);
});

test.testSync('delete with > condition', (test, { builder, params }) => {
  builder.from('Table').where('a', '>', 42);

  test.strictSame(builder.build(), 'DELETE FROM "Table" WHERE "a" > $1');
  test.strictSame(params.build(), [42]);
});

test.testSync(
  'delete with simple or condition',
  (test, { builder, params }) => {
    builder.from('Table').whereEq('a', '42').orWhere('b', '=', '24');

    test.strictSame(
      builder.build(),
      'DELETE FROM "Table" WHERE "a" = $1 OR "b" = $2'
    );
    test.strictSame(params.build(), ['42', '24']);
  }
);

test.testSync('delete with null and condition', (test, { builder, params }) => {
  builder.from('Table').whereMore('a', 999).whereNull('b');

  test.strictSame(
    builder.build(),
    'DELETE FROM "Table" WHERE "a" > $1 AND "b" IS NULL'
  );
  test.strictSame(params.build(), [999]);
});

test.testSync(
  'delete with condition in nested',
  (test, { builder, params }) => {
    const nestedQuery = new SelectBuilder(params);
    nestedQuery.from('table2').select('a').where('id', '>', 42);

    builder.from('Table').whereIn('a', nestedQuery);

    test.strictSame(
      builder.build(),
      `DELETE FROM "Table" WHERE "a" IN (SELECT "a" FROM "table2" WHERE "id" > $1)`
    );
    test.strictSame(params.build(), [42]);
  }
);

test.testSync(
  'delete with condition in nested builder',
  (test, { builder, params }) => {
    builder
      .from('Table')
      .whereIn('a', (b) => b.from('table2').select('a').where('id', '>', 42));

    test.strictSame(
      builder.build(),
      `DELETE FROM "Table" WHERE "a" IN (SELECT "a" FROM "table2" WHERE "id" > $1)`
    );
    test.strictSame(params.build(), [42]);
  }
);
