'use strict';

const { testSync } = require('metatests');
const { SelectBuilder } = require('../lib/select-builder');
const { RawBuilder } = require('../lib/query-builder.js');
const { PostgresParamsBuilder } = require('../lib/pg-params-builder');

const allowedConditions = new Set([
  '=',
  '!=',
  '<>',
  '<',
  '<=',
  '>',
  '>=',
  'LIKE',
  'EXISTS',
  'IS',
  'IS DISTINCT',
  'IN',
  'NOT IN',
  'BETWEEN',
  'BETWEEN SYMMETRIC',
  'NOT BETWEEN',
  'NOT BETWEEN SYMMETRIC',
]);

const test = testSync('Select tests', null, { parallelSubtests: true });
test.beforeEach((test, callback) => {
  const params = new PostgresParamsBuilder();
  callback({ builder: new SelectBuilder(params), params });
});

test.testSync('Simple all', (test, { builder, params }) => {
  builder.from('table');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table"');
  test.strictSame(params.build(), []);
});

test.testSync('Simple distinct select all', (test, { builder, params }) => {
  builder.from('table').distinct();
  const query = builder.build();
  test.strictSame(query, 'SELECT DISTINCT * FROM "table"');
  test.strictSame(params.build(), []);
});

test.testSync('Simple field', (test, { builder, params }) => {
  builder.select('a').from('table');
  const query = builder.build();
  test.strictSame(query, 'SELECT "a" FROM "table"');
  test.strictSame(params.build(), []);
});

test.testSync('Simple multiple field', (test, { builder, params }) => {
  builder.select('a', 'b').from('table');
  const query = builder.build();
  test.strictSame(query, 'SELECT "a", "b" FROM "table"');
  test.strictSame(params.build(), []);
});

test.testSync('Simple distinct multiple field', (test, { builder, params }) => {
  builder.select('a', 'b').from('table').distinct();
  const query = builder.build();
  test.strictSame(query, 'SELECT DISTINCT "a", "b" FROM "table"');
  test.strictSame(params.build(), []);
});

test.testSync('Select all single where', (test, { builder, params }) => {
  builder.from('table').where('f1', '=', 3);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" = $1');
  test.strictSame(params.build(), [3]);
});

test.testSync('Select where builder', (test, { builder, params }) => {
  builder.from('table').where((b) => b.and('f1', '=', 3).or('f2', '>', 42));
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE ("f1" = $1 OR "f2" > $2)'
  );
  test.strictSame(params.build(), [3, 42]);
});

test.testSync('Select where value builder', (test, { builder, params }) => {
  builder
    .from('table')
    .where('f1', '=', (b) =>
      b
        .select('a')
        .from('table1')
        .where('f1', '=', 3)
        .orWhere('f2', '>', 42)
        .limit(1)
    );
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table" WHERE
    "f1" = (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2 LIMIT $3)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [3, 42, 1]);
});

test.testSync('Select all single orWhere', (test, { builder, params }) => {
  builder.from('table').orWhere('f1', '=', 3);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" = $1');
  test.strictSame(params.build(), [3]);
});

test.testSync('Select all orWhere builder', (test, { builder, params }) => {
  builder.from('table').orWhere((b) => b.and('f1', '=', 3).or('f2', '>', 42));
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE ("f1" = $1 OR "f2" > $2)'
  );
  test.strictSame(params.build(), [3, 42]);
});

test.testSync('Select orWhere value builder', (test, { builder, params }) => {
  builder
    .from('table')
    .orWhere('f1', '=', (b) =>
      b
        .select('a')
        .from('table1')
        .where('f1', '=', 3)
        .orWhere('f2', '>', 42)
        .limit(1)
    );
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table" WHERE
    "f1" = (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2 LIMIT $3)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [3, 42, 1]);
});

test.testSync('Select all single where not', (test, { builder, params }) => {
  builder.from('table').whereNot('f1', '=', 3);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE NOT "f1" = $1');
  test.strictSame(params.build(), [3]);
});

test.testSync('Select whereNot value builder', (test, { builder, params }) => {
  builder
    .from('table')
    .whereNot('f1', '=', (b) =>
      b
        .select('a')
        .from('table1')
        .where('f1', '=', 3)
        .orWhere('f2', '>', 42)
        .limit(1)
    );
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table" WHERE
    NOT "f1" = (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2 LIMIT $3)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [3, 42, 1]);
});

test.testSync('Select all single orWhere not', (test, { builder, params }) => {
  builder.from('table').orWhereNot('f1', '=', 3);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE NOT "f1" = $1');
  test.strictSame(params.build(), [3]);
});

test.testSync(
  'Select orWhereNot value builder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .orWhereNot('f1', '=', (b) =>
        b
          .select('a')
          .from('table1')
          .where('f1', '=', 3)
          .orWhere('f2', '>', 42)
          .limit(1)
      );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
    NOT "f1" = (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2 LIMIT $3)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 42, 1]);
  }
);

test.testSync('Select all multiple where', (test, { builder, params }) => {
  builder
    .from('table')
    .where('f1', '=', 3)
    .where('f2', '<', 'abc')
    .orWhereNot('f3', '>', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE "f1" = $1 AND "f2" < $2 OR NOT "f3" > $3'
  );
  test.strictSame(params.build(), [3, 'abc', 42]);
});

test.testSync(
  'Select all multiple where count',
  (test, { builder, params }) => {
    builder
      .from('table')
      .where('f1', '=', 3)
      .where('f2', '<', 'abc')
      .count('f0');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT count("f0") FROM "table" WHERE "f1" = $1 AND "f2" < $2'
    );
    test.strictSame(params.build(), [3, 'abc']);
  }
);

test.testSync(
  'Select all multiple where count over',
  (test, { builder, params }) => {
    builder
      .from('table')
      .where('f1', '=', 3)
      .where('f2', '<', 'abc')
      .countOver('f0');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT (COUNT("f0") OVER()) FROM "table" WHERE "f1" = $1 AND "f2" < $2'
    );
    test.strictSame(params.build(), [3, 'abc']);
  }
);

test.testSync(
  'Select all multiple where count over alias',
  (test, { builder, params }) => {
    builder
      .from('table')
      .where('f1', '=', 3)
      .where('f2', '<', 'abc')
      .countOver('f0', 'count');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT (COUNT("f0") OVER()) AS "count" FROM "table" WHERE "f1" = $1 AND "f2" < $2'
    );
    test.strictSame(params.build(), [3, 'abc']);
  }
);

test.testSync('Select few where avg', (test, { builder, params }) => {
  builder.from('table').select('f1', 'f2').where('f1', '=', 3).avg('f0');
  // Note that this is not a correct PostgreSQL query as the select fields
  // are not present in the groupBy section. PG will fail with:
  // 'ERROR: column "table.f1", "table.f2" must appear in the GROUP BY clause
  //  or be used in an aggregate function'.
  //  But this is not the job of an SQL generator to catch these
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "f1", "f2", avg("f0") FROM "table" WHERE "f1" = $1'
  );
  test.strictSame(params.build(), [3]);
});

test.testSync('Select few where avg', (test, { builder, params }) => {
  builder
    .from('table')
    .select('f1', 'f2')
    .where('f1', '=', 3)
    .groupBy('f1', 'f2')
    .min('f0');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "f1", "f2", min("f0") FROM "table" ' +
      'WHERE "f1" = $1 GROUP BY "f1", "f2"'
  );
  test.strictSame(params.build(), [3]);
});

test.testSync('Select all where max', (test, { builder, params }) => {
  builder.from('table').where('f2', '=', 3).max('f1');
  const query = builder.build();
  test.strictSame(query, 'SELECT max("f1") FROM "table" WHERE "f2" = $1');
  test.strictSame(params.build(), [3]);
});

test.testSync('Select all where limit', (test, { builder, params }) => {
  builder.from('table').where('f2', '=', 3).limit(10);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f2" = $1 LIMIT $2');
  test.strictSame(params.build(), [3, 10]);
});

test.testSync('Select all where offset', (test, { builder, params }) => {
  builder.from('table').where('f2', '=', 3).offset(10);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f2" = $1 OFFSET $2');
  test.strictSame(params.build(), [3, 10]);
});

test.testSync('Select all order offset', (test, { builder, params }) => {
  builder.from('table').orderBy('f1').offset(10);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" ORDER BY "f1" ASC OFFSET $1');
  test.strictSame(params.build(), [10]);
});

test.testSync('Select order by raw', (test, { builder, params }) => {
  builder
    .from('table')
    .orderBy('f5', 'DESC')
    .orderByRaw('least("f1", "f2") ASC');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" ORDER BY "f5" DESC, least("f1", "f2") ASC'
  );
  test.strictSame(params.build(), []);
});

test.testSync('Select all order by raw query', (test, { builder, params }) => {
  builder
    .from('table')
    .orderBy('f5', 'DESC')
    .orderByRaw(builder.raw((p) => `least("f1", "f2", ${p.add(42)}) ASC`));
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" ORDER BY "f5" DESC, least("f1", "f2", $1) ASC'
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select few order desc limit', (test, { builder, params }) => {
  builder.from('table').select('f1', 'f2').orderBy('f1', 'desc').limit(10);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "f1", "f2" FROM "table" ORDER BY "f1" DESC LIMIT $1'
  );
  test.strictSame(params.build(), [10]);
});

test.testSync(
  'Select few where order limit offset',
  (test, { builder, params }) => {
    builder
      .from('table')
      .select('f1')
      .where('f2', '=', 3)
      .offset(10)
      .orderBy('f1')
      .select('f3');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT "f1", "f3" FROM "table" WHERE "f2" = $1 ' +
        'ORDER BY "f1" ASC OFFSET $2'
    );
    test.strictSame(params.build(), [3, 10]);
  }
);

test.testSync('Select where date', (test, { builder, params }) => {
  const date = new Date(1537025908018); // 2018-09-15T15:38:28.018Z
  builder.from('table').where('f2', '=', date, { date: 'date' });
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f2" = $1');
  test.strictSame(params.build(), [date]);
});

test.testSync('Select where null', (test, { builder, params }) => {
  builder.from('table').whereNull('f1');
  test.strictSame(builder.build(), 'SELECT * FROM "table" WHERE "f1" IS NULL');
  test.strictSame(params.build(), []);
});

test.testSync('Select orWhere null', (test, { builder, params }) => {
  builder.from('table').orWhereNull('f1');
  test.strictSame(builder.build(), 'SELECT * FROM "table" WHERE "f1" IS NULL');
  test.strictSame(params.build(), []);
});

test.testSync('Select all whereNotNull', (test, { builder, params }) => {
  builder.from('table').whereNotNull('f1');
  test.strictSame(
    builder.build(),
    'SELECT * FROM "table" WHERE "f1" IS NOT NULL'
  );
  test.strictSame(params.build(), []);
});

test.testSync('Select all orWhereNotNull', (test, { builder, params }) => {
  builder.from('table').orWhereNotNull('f1');
  test.strictSame(
    builder.build(),
    'SELECT * FROM "table" WHERE "f1" IS NOT NULL'
  );
  test.strictSame(params.build(), []);
});

test.testSync(
  'Select all whereNotNull/orWhereNotNull',
  (test, { builder, params }) => {
    builder.from('table').whereNotNull('f1').orWhereNotNull('f2');
    test.strictSame(
      builder.build(),
      'SELECT * FROM "table" WHERE "f1" IS NOT NULL OR "f2" IS NOT NULL'
    );
    test.strictSame(params.build(), []);
  }
);

test.testSync(
  'Select where time with timezone',
  (test, { builder, params }) => {
    const time = new Date(1537025908018); // 2018-09-15T15:38:28.018Z
    builder
      .from('table')
      .where('f2', '=', time, { date: 'time with time zone' });
    const query = builder.build();
    test.strictSame(query, 'SELECT * FROM "table" WHERE "f2" = $1');
    test.strictSame(params.build(), [time]);
  }
);

test.testSync(
  'Select where timestamp with timezone',
  (test, { builder, params }) => {
    const time = new Date(1537025908018); // 2018-09-15T15:38:28.018Z
    builder
      .from('table')
      .where('f2', '=', time, { date: 'timestamp with time zone' });
    const query = builder.build();
    test.strictSame(query, 'SELECT * FROM "table" WHERE "f2" = $1');
    test.strictSame(params.build(), [time]);
  }
);

test.testSync('Select where in numbers', (test, { builder, params }) => {
  builder.from('table').whereIn('f1', [1, 2, 3]);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" IN ($1, $2, $3)');
  test.strictSame(params.build(), [1, 2, 3]);
});

test.testSync('Select whereIn value builder', (test, { builder, params }) => {
  builder
    .from('table')
    .whereIn('f1', (b) =>
      b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
    );
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table" WHERE
    "f1" IN (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [3, 42]);
});

test.testSync('Select orWhere in numbers', (test, { builder, params }) => {
  builder.from('table').orWhereIn('f1', [1, 2, 3]);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" IN ($1, $2, $3)');
  test.strictSame(params.build(), [1, 2, 3]);
});

test.testSync('Select orWhereIn value builder', (test, { builder, params }) => {
  builder
    .from('table')
    .orWhereIn('f1', (b) =>
      b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
    );
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table" WHERE
    "f1" IN (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [3, 42]);
});

test.testSync('Select whereIn/orWhereIn', (test, { builder, params }) => {
  builder.from('table').whereIn('f1', [1, 2, 3]).orWhereIn('f2', [3, 2, 1]);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE "f1" IN ($1, $2, $3) OR "f2" IN ($4, $5, $6)'
  );
  test.strictSame(params.build(), [1, 2, 3, 3, 2, 1]);
});

test.testSync('Select where in set', (test, { builder, params }) => {
  builder.from('table').whereIn('f1', new Set([1, 2, 3]));
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" IN ($1, $2, $3)');
  test.strictSame(params.build(), [1, 2, 3]);
});

test.testSync('Select whereNotIn numbers', (test, { builder, params }) => {
  builder.from('table').whereNotIn('f1', [1, 2, 3]);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE "f1" NOT IN ($1, $2, $3)'
  );
  test.strictSame(params.build(), [1, 2, 3]);
});

test.testSync(
  'Select whereNotIn value builder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .whereNotIn('f1', (b) =>
        b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
      );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "f1" NOT IN (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 42]);
  }
);

test.testSync('Select orWhereNotIn numbers', (test, { builder, params }) => {
  builder.from('table').orWhereNotIn('f1', [1, 2, 3]);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE "f1" NOT IN ($1, $2, $3)'
  );
  test.strictSame(params.build(), [1, 2, 3]);
});

test.testSync(
  'Select orWhereNotIn value builder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .orWhereNotIn('f1', (b) =>
        b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
      );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "f1" NOT IN (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 42]);
  }
);

test.testSync('Select whereNotIn/orWhereNotIn', (test, { builder, params }) => {
  builder
    .from('table')
    .whereNotIn('f1', [1, 2, 3])
    .orWhereNotIn('f2', [3, 2, 1]);
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table"
    WHERE "f1" NOT IN ($1, $2, $3)
          OR "f2" NOT IN ($4, $5, $6)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [1, 2, 3, 3, 2, 1]);
});

test.testSync('Select whereAny numbers', (test, { builder, params }) => {
  builder.from('table').whereAny('f1', [1, 2, 3]);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" = ANY ($1)');
  test.strictSame(params.build(), [[1, 2, 3]]);
});

test.testSync('Select whereAny value builder', (test, { builder, params }) => {
  builder
    .from('table')
    .whereAny('f1', (b) =>
      b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
    );
  const query = builder.build();
  const expectedSql = `SELECT * FROM "table" WHERE
      "f1" = ANY (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
  test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [3, 42]);
});

test.testSync('Select orWhereAny numbers', (test, { builder, params }) => {
  builder.from('table').orWhereAny('f1', [1, 2, 3]);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" = ANY ($1)');
  test.strictSame(params.build(), [[1, 2, 3]]);
});

test.testSync(
  'Select orWhereAny value builder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .orWhereAny('f1', (b) =>
        b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
      );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "f1" = ANY (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 42]);
  }
);

test.testSync(
  'Select whereAny/orWhereAny numbers',
  (test, { builder, params }) => {
    builder.from('table').whereAny('f1', [1, 2, 3]).orWhereAny('f1', [4, 5, 6]);
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table" WHERE "f1" = ANY ($1) OR "f1" = ANY ($2)'
    );
    test.strictSame(params.build(), [
      [1, 2, 3],
      [4, 5, 6],
    ]);
  }
);

test.testSync('Select multiple operations', (test, { builder, params }) => {
  builder.from('table').avg('f1').sum('f2');
  const query = builder.build();
  test.strictSame(query, 'SELECT avg("f1"), sum("f2") FROM "table"');
  test.strictSame(params.build(), []);
});

test.testSync('Select fn operation', (test, { builder, params }) => {
  builder.from('table').selectFn('my_function', 'f1').whereEq('f2', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT my_function("f1") FROM "table" WHERE "f2" = $1'
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select fn operation', (test, { builder, params }) => {
  builder.from('table').selectFn('array_agg', 'f1').whereEq('f2', 42);
  const query = builder.build();
  test.strictSame(query, 'SELECT array_agg("f1") FROM "table" WHERE "f2" = $1');
  test.strictSame(params.build(), [42]);
});

test.testSync('Select custom operation', (test, { builder, params }) => {
  builder.from('table').selectRaw('array_agg("f1")').whereEq('f2', 42);
  const query = builder.build();
  test.strictSame(query, 'SELECT array_agg("f1") FROM "table" WHERE "f2" = $1');
  test.strictSame(params.build(), [42]);
});

test.testSync(
  'Select raw custom operation with QueryBuilder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .selectRaw(new RawBuilder('array_agg("f1")'))
      .whereEq('f2', 42);
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT array_agg("f1") FROM "table" WHERE "f2" = $1'
    );
    test.strictSame(params.build(), [42]);
  }
);

test.testSync(
  'Select raw with function builder with QueryBuilder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .selectRaw((b) => b.from('table').select('a').limit(1))
      .whereEq('f2', 42);
    const query = builder.build();
    // Invalid query here because of selectRaw.
    test.strictSame(
      query,
      'SELECT SELECT "a" FROM "table" LIMIT $1 FROM "table" WHERE "f2" = $2'
    );
    test.strictSame(params.build(), [1, 42]);
  }
);

test.testSync(
  'Select custom operation with QueryBuilder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .select(new RawBuilder('array_agg("f1")'))
      .whereEq('f2', 42);
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT (array_agg("f1")) FROM "table" WHERE "f2" = $1'
    );
    test.strictSame(params.build(), [42]);
  }
);

test.testSync(
  'Select custom operation with QueryBuilder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .selectRaw(builder.raw('array_agg("f1")'))
      .whereEq('f2', 42);
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT array_agg("f1") FROM "table" WHERE "f2" = $1'
    );
    test.strictSame(params.build(), [42]);
  }
);

test.testSync('Select raw with count', (test, { builder, params }) => {
  builder.from('table').selectRaw('COUNT(*) as count').whereEq('f2', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT COUNT(*) as count FROM "table" WHERE "f2" = $1'
  );
  test.strictSame(params.build(), [42]);
});

test.testSync(
  'Select multiple operations order',
  (test, { builder, params }) => {
    builder.from('table').avg('f1').select('f3').sum('f2').select('f4');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT avg("f1"), "f3", sum("f2"), "f4" FROM "table"'
    );
    test.strictSame(params.build(), []);
  }
);

test.testSync(
  'Select multiple operations groupBy',
  (test, { builder, params }) => {
    builder.from('table').avg('f1').sum('f2').groupBy('a', 'b');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT avg("f1"), sum("f2") FROM "table" GROUP BY "a", "b"'
    );
    test.strictSame(params.build(), []);
  }
);

test.testSync('Select where like', (test, { builder, params }) => {
  builder.from('table').where('f1', 'like', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" LIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where not like', (test, { builder, params }) => {
  builder.from('table').where('f1', 'not like', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" NOT LIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where ilike', (test, { builder, params }) => {
  builder.from('table').where('f1', 'ilike', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" ILIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where not ilike', (test, { builder, params }) => {
  builder.from('table').where('f1', 'not ilike', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" NOT ILIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where shortcut like', (test, { builder, params }) => {
  builder.from('table').whereLike('f1', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" LIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where shortcut not like', (test, { builder, params }) => {
  builder.from('table').whereNotLike('f1', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" NOT LIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync(
  'Select where shortcut like or not like',
  (test, { builder, params }) => {
    builder.from('table').whereLike('f1', 'abc').orWhereNotLike('f2', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table" WHERE "f1" LIKE $1 OR "f2" NOT LIKE $2'
    );
    test.strictSame(params.build(), ['abc', 'abc']);
  }
);

test.testSync(
  'Select where shortcut not like or like',
  (test, { builder, params }) => {
    builder.from('table').whereNotLike('f1', 'abc').orWhereLike('f2', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table" WHERE "f1" NOT LIKE $1 OR "f2" LIKE $2'
    );
    test.strictSame(params.build(), ['abc', 'abc']);
  }
);

test.testSync('Select where shortcut ilike', (test, { builder, params }) => {
  builder.from('table').whereILike('f1', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" ILIKE $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync(
  'Select where shortcut not ilike',
  (test, { builder, params }) => {
    builder.from('table').whereNotILike('f1', 'abc');
    const query = builder.build();
    test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" NOT ILIKE $1');
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select where shortcut ilike or not ilike',
  (test, { builder, params }) => {
    builder.from('table').whereILike('f1', 'abc').orWhereNotILike('f2', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table" WHERE "f1" ILIKE $1 OR "f2" NOT ILIKE $2'
    );
    test.strictSame(params.build(), ['abc', 'abc']);
  }
);

test.testSync(
  'Select where shortcut not ilike or ilike',
  (test, { builder, params }) => {
    builder.from('table').whereNotILike('f1', 'abc').orWhereILike('f2', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table" WHERE "f1" NOT ILIKE $1 OR "f2" ILIKE $2'
    );
    test.strictSame(params.build(), ['abc', 'abc']);
  }
);

test.testSync(
  'Select where or ilike or ilike and like',
  (test, { builder, params }) => {
    builder
      .from('table')
      .orWhereILike('f1', 'abc')
      .orWhereILike('f2', 'abc')
      .whereLike('f3', 'bbb');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table" WHERE "f1" ILIKE $1 OR "f2" ILIKE $2 AND "f3" LIKE $3'
    );
    test.strictSame(params.build(), ['abc', 'abc', 'bbb']);
  }
);

test.testSync('Select where <>', (test, { builder, params }) => {
  builder.from('table').where('f1', '<>', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" <> $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where !=', (test, { builder, params }) => {
  builder.from('table').where('f1', '!=', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" <> $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where =', (test, { builder, params }) => {
  builder.from('table').where('f1', '=', 'abc').whereEq('f2', 'cba');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" = $1 AND "f2" = $2');
  test.strictSame(params.build(), ['abc', 'cba']);
});

test.testSync('Select multiple from', (test, { builder, params }) => {
  builder.from('table1').from('table2');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table1", "table2"');
  test.strictSame(params.build(), []);
});

test.testSync('Select name with table', (test, { builder, params }) => {
  builder.from('table').where('table.a', '=', 1);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "table"."a" = $1');
  test.strictSame(params.build(), [1]);
});

test.testSync('Select rows with where', (test, { builder, params }) => {
  builder.from('table1').from('table2').where('f1', '=', 'abc');
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table1", "table2" WHERE "f1" = $1');
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where >', (test, { builder, params }) => {
  builder.from('table').where('f1', '>', 'abc').whereMore('f2', 42);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" > $1 AND "f2" > $2');
  test.strictSame(params.build(), ['abc', 42]);
});

test.testSync('Select where >=', (test, { builder, params }) => {
  builder.from('table').where('f1', '>=', 'abc').whereMoreEq('f2', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE "f1" >= $1 AND "f2" >= $2'
  );
  test.strictSame(params.build(), ['abc', 42]);
});

test.testSync('Select where <', (test, { builder, params }) => {
  builder.from('table').where('f1', '<', 'abc').whereLess('f2', 42);
  const query = builder.build();
  test.strictSame(query, 'SELECT * FROM "table" WHERE "f1" < $1 AND "f2" < $2');
  test.strictSame(params.build(), ['abc', 42]);
});

test.testSync('Select where <=', (test, { builder, params }) => {
  builder.from('table').where('f1', '<=', 'abc').whereLessEq('f2', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table" WHERE "f1" <= $1 AND "f2" <= $2'
  );
  test.strictSame(params.build(), ['abc', 42]);
});

test.testSync(
  'Select rows with multiple where',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .from('table2')
      .where('table1.f', '=', 'abc')
      .where('table2.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1", "table2" ' +
        'WHERE "table1"."f" = $1 AND "table2"."f" = $2'
    );
    test.strictSame(params.build(), ['abc', 'abc']);
  }
);

test.testSync('Select with inner join', (test, { builder, params }) => {
  builder
    .from('table1')
    .innerJoin('table2', 'table1.f', 'table2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'INNER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with inner join as', (test, { builder, params }) => {
  builder
    .from('table1')
    .innerJoinAs('table2', 't2', 'table1.f', 't2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'INNER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync(
  'Select with inner join condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .innerJoinCond(
        'table2',
        builder.raw(() => `"table1"."f" = "table2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'INNER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with inner join as condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .innerJoinCondAs(
        'table2',
        't2',
        builder.raw(() => `"table1"."f" = "t2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'INNER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with inner join and where raw',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .innerJoin('table2', 'table1.f', 'table2.f')
      .where('table1.f', '=', 'abc')
      .whereRaw('"table1"."d" = "table2"."d"')
      .orWhereNotRaw('"table1"."e" = "table2"."e"');

    test.strictSame(
      builder.build(),
      'SELECT * FROM "table1" ' +
        'INNER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1 AND "table1"."d" = "table2"."d" OR NOT "table1"."e" = "table2"."e"'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with inner join and where key',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .innerJoin('table2', 'table1.f', 'table2.f')
      .where('table1.f', '=', 'abc')
      .whereKey('table1.d', '=', 'table2.d')
      .orWhereNotKey('table1.e', '=', 'table2.e');

    test.strictSame(
      builder.build(),
      'SELECT * FROM "table1" ' +
        'INNER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1 AND "table1"."d" = "table2"."d" OR NOT "table1"."e" = "table2"."e"'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with inner join and where not key',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .innerJoin('table2', 'table1.f', 'table2.f')
      .where('table1.f', '=', 'abc')
      .whereNotKey('table1.d', '=', 'table2.d')
      .whereNotKey('table1.e', '=', 'table2.e');

    test.strictSame(
      builder.build(),
      'SELECT * FROM "table1" ' +
        'INNER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1 AND NOT "table1"."d" = "table2"."d" AND NOT "table1"."e" = "table2"."e"'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with multiple inner joins',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .innerJoin('table2', 'table1.f', 'table2.f')
      .innerJoin('table3', 'table1.f', 'table3.f')
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'INNER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'INNER JOIN "table3" ON "table1"."f" = "table3"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync('Select with left join', (test, { builder, params }) => {
  builder
    .from('table1')
    .leftJoin('table2', 'table1.f', 'table2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'LEFT OUTER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with left join as', (test, { builder, params }) => {
  builder
    .from('table1')
    .leftJoinAs('table2', 't2', 'table1.f', 't2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'LEFT OUTER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync(
  'Select with left join condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .leftJoinCond(
        'table2',
        builder.raw(() => `"table1"."f" = "table2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'LEFT OUTER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with left join as condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .leftJoinCondAs(
        'table2',
        't2',
        builder.raw(() => `"table1"."f" = "t2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'LEFT OUTER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync('Select with right join', (test, { builder, params }) => {
  builder
    .from('table1')
    .rightJoin('table2', 'table1.f', 'table2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'RIGHT OUTER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with right join as', (test, { builder, params }) => {
  builder
    .from('table1')
    .rightJoinAs('table2', 't2', 'table1.f', 't2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'RIGHT OUTER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync(
  'Select with right join condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .rightJoinCond(
        'table2',
        builder.raw(() => `"table1"."f" = "table2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'RIGHT OUTER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with right join as condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .rightJoinCondAs(
        'table2',
        't2',
        builder.raw(() => `"table1"."f" = "t2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'RIGHT OUTER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync('Select with full join', (test, { builder, params }) => {
  builder
    .from('table1')
    .fullJoin('table2', 'table1.f', 'table2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'FULL OUTER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with full join as', (test, { builder, params }) => {
  builder
    .from('table1')
    .fullJoinAs('table2', 't2', 'table1.f', 't2.f')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" ' +
      'FULL OUTER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
      'WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync(
  'Select with full join condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .fullJoinCond(
        'table2',
        builder.raw(() => `"table1"."f" = "table2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'FULL OUTER JOIN "table2" ON "table1"."f" = "table2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync(
  'Select with full join as condition',
  (test, { builder, params }) => {
    builder
      .from('table1')
      .fullJoinCondAs(
        'table2',
        't2',
        builder.raw(() => `"table1"."f" = "t2"."f"`)
      )
      .where('table1.f', '=', 'abc');
    const query = builder.build();
    test.strictSame(
      query,
      'SELECT * FROM "table1" ' +
        'FULL OUTER JOIN "table2" AS "t2" ON "table1"."f" = "t2"."f" ' +
        'WHERE "table1"."f" = $1'
    );
    test.strictSame(params.build(), ['abc']);
  }
);

test.testSync('Select with natural join', (test, { builder, params }) => {
  builder.from('table1').naturalJoin('table2').where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" NATURAL JOIN "table2" WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with natural join as', (test, { builder, params }) => {
  builder
    .from('table1')
    .naturalJoinAs('table2', 't2')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" NATURAL JOIN "table2" AS "t2" WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with cross join', (test, { builder, params }) => {
  builder.from('table1').crossJoin('table2').where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" CROSS JOIN "table2" WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select with cross join as', (test, { builder, params }) => {
  builder
    .from('table1')
    .crossJoinAs('table2', 't2')
    .where('table1.f', '=', 'abc');
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" CROSS JOIN "table2" AS "t2" WHERE "table1"."f" = $1'
  );
  test.strictSame(params.build(), ['abc']);
});

test.testSync('Select where nested', (test, { builder, params }) => {
  const nested = new SelectBuilder(builder.params)
    .from('table2')
    .select('A')
    .where('f1', '=', 42);
  builder.from('table1').where('a', '=', nested);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" WHERE "a" = (SELECT "A" FROM "table2" WHERE "f1" = $1)'
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select where nested raw', (test, { builder, params }) => {
  const nested = new RawBuilder(
    (params) => `SELECT "A" FROM "table2" WHERE "f1" = ${params.add(42)}`,
    params
  );
  builder.from('table1').where('f1', '=', nested);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT * FROM "table1" WHERE "f1" = (SELECT "A" FROM "table2" WHERE "f1" = $1)'
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select whereExists', (test, { builder, params }) => {
  const nested = new SelectBuilder(params).from('table2').where('f1', '=', 42);
  builder.from('table1').whereExists(nested).where('f1', '=', 13);
  const expectedSql = `SELECT * FROM "table1" WHERE
    EXISTS (SELECT * FROM "table2" WHERE "f1" = $1) AND "f1" = $2`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [42, 13]);
});

test.testSync(
  'Select whereExists value builder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .whereExists((b) =>
        b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
      );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      EXISTS (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 42]);
  }
);

test.testSync('Select orWhereExists', (test, { builder, params }) => {
  const nested = new SelectBuilder(params).from('table2').where('f1', '=', 42);
  builder.from('table1').where('f1', '=', 13).orWhereExists(nested);
  const expectedSql = `SELECT * FROM "table1" WHERE
     "f1" = $1 OR EXISTS (SELECT * FROM "table2" WHERE "f1" = $2)`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [13, 42]);
});

test.testSync(
  'Select orWhereExists value builder',
  (test, { builder, params }) => {
    builder
      .from('table')
      .orWhereExists((b) =>
        b.select('a').from('table1').where('f1', '=', 3).orWhere('f2', '>', 42)
      );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      EXISTS (SELECT "a" FROM "table1" WHERE "f1" = $1 OR "f2" > $2)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 42]);
  }
);

test.testSync(
  'Select whereExists/orWhereExists',
  (test, { builder, params }) => {
    const nested = new SelectBuilder(params)
      .from('table2')
      .where('f1', '=', 42);
    builder
      .from('table1')
      .whereExists(nested)
      .where('f1', '=', 13)
      .orWhereExists(nested);
    const expectedSql = `SELECT * FROM "table1" WHERE
      EXISTS (SELECT * FROM "table2" WHERE "f1" = $1)
      AND "f1" = $2 OR EXISTS (SELECT * FROM "table2" WHERE "f1" = $3)`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [42, 13, 42]);
  }
);

test.testSync('Select simple alias', (test, { builder }) => {
  builder.from('table1').selectAs('f1', 'hello').selectAs('f2', 'bye');
  test.strictSame(
    builder.build(),
    'SELECT "f1" AS "hello", "f2" AS "bye" FROM "table1"'
  );
});

test.testSync('Select alias with fn', (test, { builder }) => {
  builder
    .from('table1')
    .selectAs('f1', 'hello')
    .count('*', 'counted')
    .select('f2')
    .max('f1', 'maxf1')
    .min('f2', 'minf2')
    .avg('f3', 'avgf3');
  test.strictSame(
    builder.build(),
    `SELECT "f1" AS "hello",
              count(*) AS "counted",
              "f2",
              max("f1") AS "maxf1",
              min("f2") AS "minf2",
              avg("f3") AS "avgf3"
       FROM "table1"`.replace(/\n\s+/g, ' ')
  );
});

test.testSync('Select simple use alias', (test, { builder }) => {
  builder.from('table1').selectAs('f1', 'hello').select('f2').groupBy('hello');
  test.strictSame(
    builder.build(),
    'SELECT "f1" AS "hello", "f2" FROM "table1" GROUP BY "hello"'
  );
});

test.testSync('Select group by raw', (test, { builder }) => {
  builder.from('table1').groupByRaw('date("f1")').groupBy('f2');
  test.strictSame(
    builder.build(),
    'SELECT * FROM "table1" GROUP BY date("f1"), "f2"'
  );
});

test.testSync('Select group by raw query', (test, { builder }) => {
  builder
    .from('table1')
    .groupByRaw(builder.raw(() => 'date("f1")'))
    .groupBy('f2');
  test.strictSame(
    builder.build(),
    'SELECT * FROM "table1" GROUP BY date("f1"), "f2"'
  );
});

test.testSync('Select whereBetween', (test, { builder, params }) => {
  builder
    .from('table1')
    .whereBetween('a', 1, 100)
    .whereBetween('b', 100, 1, true)
    .whereBetween('c', 'aaa', 'yyy');
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1"
     WHERE "a" BETWEEN $1 AND $2
       AND "b" BETWEEN SYMMETRIC $3 AND $4
       AND "c" BETWEEN $5 AND $6`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [1, 100, 100, 1, 'aaa', 'yyy']);
});

test.testSync(
  'Select whereBetween value builder',
  (test, { builder, params }) => {
    builder.from('table').whereBetween(
      'a',
      (b) => b.select('f1').from('table1').where('f1', '=', 3).limit(1),
      (b) => b.select('f2').from('table2').where('f2', '>', 42).limit(1)
    );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "a" BETWEEN (SELECT "f1" FROM "table1" WHERE "f1" = $1 LIMIT $2) AND
                  (SELECT "f2" FROM "table2" WHERE "f2" > $3 LIMIT $4)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 1, 42, 1]);
  }
);

test.testSync('Select orWhereBetween', (test, { builder, params }) => {
  builder
    .from('table1')
    .orWhereBetween('a', 1, 100)
    .orWhereBetween('b', 100, 1, true)
    .orWhereBetween('c', 'aaa', 'yyy');
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1"
     WHERE "a" BETWEEN $1 AND $2
       OR "b" BETWEEN SYMMETRIC $3 AND $4
       OR "c" BETWEEN $5 AND $6`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [1, 100, 100, 1, 'aaa', 'yyy']);
});

test.testSync(
  'Select orWhereBetween value builder',
  (test, { builder, params }) => {
    builder.from('table').orWhereBetween(
      'a',
      (b) => b.select('f1').from('table1').where('f1', '=', 3).limit(1),
      (b) => b.select('f2').from('table2').where('f2', '>', 42).limit(1)
    );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "a" BETWEEN (SELECT "f1" FROM "table1" WHERE "f1" = $1 LIMIT $2) AND
                  (SELECT "f2" FROM "table2" WHERE "f2" > $3 LIMIT $4)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 1, 42, 1]);
  }
);

test.testSync('Select orWhereBetweenNot', (test, { builder, params }) => {
  builder
    .from('table1')
    .orWhereNotBetween('a', 1, 100)
    .orWhereNotBetween('b', 'aaa', 'yyy', true);
  const expectedSql = `SELECT * FROM "table1"
     WHERE "a" NOT BETWEEN $1 AND $2
       OR "b" NOT BETWEEN SYMMETRIC $3 AND $4`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [1, 100, 'aaa', 'yyy']);
});

test.testSync(
  'Select orWhereNotBetween value builder',
  (test, { builder, params }) => {
    builder.from('table').orWhereNotBetween(
      'a',
      (b) => b.select('f1').from('table1').where('f1', '=', 3).limit(1),
      (b) => b.select('f2').from('table2').where('f2', '>', 42).limit(1)
    );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "a" NOT BETWEEN (SELECT "f1" FROM "table1" WHERE "f1" = $1 LIMIT $2) AND
                      (SELECT "f2" FROM "table2" WHERE "f2" > $3 LIMIT $4)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 1, 42, 1]);
  }
);

test.testSync(
  'Select whereNotBetween value builder',
  (test, { builder, params }) => {
    builder.from('table').whereNotBetween(
      'a',
      (b) => b.select('f1').from('table1').where('f1', '=', 3).limit(1),
      (b) => b.select('f2').from('table2').where('f2', '>', 42).limit(1)
    );
    const query = builder.build();
    const expectedSql = `SELECT * FROM "table" WHERE
      "a" NOT BETWEEN (SELECT "f1" FROM "table1" WHERE "f1" = $1 LIMIT $2) AND
                      (SELECT "f2" FROM "table2" WHERE "f2" > $3 LIMIT $4)`;
    test.strictSame(query, expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [3, 1, 42, 1]);
  }
);

test.testSync('Select where between multiple', (test, { builder, params }) => {
  builder
    .from('table1')
    .whereNotBetween('a', 1, 100)
    .orWhereBetween('b', 1, 100)
    .whereBetween('b', 'xzy', 'yyy', true)
    .whereNotBetween('c', 'aaa', 'yyy', true)
    .whereBetween('d', 42, 100)
    .orWhereNotBetween('d', 3, 42);
  const expectedSql = `SELECT * FROM "table1" WHERE
       "a" NOT BETWEEN $1 AND $2
       OR "b" BETWEEN $3 AND $4
       AND "b" BETWEEN SYMMETRIC $5 AND $6
       AND "c" NOT BETWEEN SYMMETRIC $7 AND $8
       AND "d" BETWEEN $9 AND $10
       OR "d" NOT BETWEEN $11 AND $12`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  const args = [1, 100, 1, 100, 'xzy', 'yyy', 'aaa', 'yyy', 42, 100, 3, 42];
  test.strictSame(params.build(), args);
});

test.testSync('Select whereIn nested', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42);

  builder.from('table1').whereIn('a', nestedQuery);
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1" WHERE "a" IN
       (SELECT "a" FROM "table2" WHERE "id" > $1)`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select orWhereIn nested', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42);

  builder.from('table1').orWhereIn('a', nestedQuery);
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1" WHERE "a" IN
       (SELECT "a" FROM "table2" WHERE "id" > $1)`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [42]);
});

test.testSync(
  'Select whereIn/orWhereIn nested',
  (test, { builder, params }) => {
    const nestedQuery = new SelectBuilder(params);
    nestedQuery.from('table2').select('a').where('id', '>', 42);

    builder
      .from('table1')
      .whereIn('a', nestedQuery)
      .orWhereIn('b', nestedQuery);
    const expectedSql = `SELECT * FROM "table1" WHERE
         "a" IN (SELECT "a" FROM "table2" WHERE "id" > $1)
         OR "b" IN (SELECT "a" FROM "table2" WHERE "id" > $2)`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [42, 42]);
  }
);

test.testSync('Select whereNotIn nested', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42);

  builder.from('table1').whereNotIn('a', nestedQuery);
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1" WHERE "a" NOT IN
       (SELECT "a" FROM "table2" WHERE "id" > $1)`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select orWhereNotIn nested', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42);

  builder.from('table1').orWhereNotIn('a', nestedQuery);
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1" WHERE "a" NOT IN
       (SELECT "a" FROM "table2" WHERE "id" > $1)`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [42]);
});

test.testSync(
  'Select whereNotIn/orWhereNotIn nested',
  (test, { builder, params }) => {
    const nestedQuery = new SelectBuilder(params);
    nestedQuery.from('table2').select('a').where('id', '>', 42);

    builder
      .from('table1')
      .whereNotIn('a', nestedQuery)
      .orWhereNotIn('b', nestedQuery);
    const expectedSql = `SELECT * FROM "table1" WHERE
       "a" NOT IN (SELECT "a" FROM "table2" WHERE "id" > $1)
       OR "b" NOT IN (SELECT "a" FROM "table2" WHERE "id" > $2)`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [42, 42]);
  }
);

test.testSync('Select whereAny nested', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42);

  builder.from('table1').whereAny('a', nestedQuery);
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1" WHERE "a" = ANY
       (SELECT "a" FROM "table2" WHERE "id" > $1)`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [42]);
});

test.testSync('Select orWhereAny nested', (test, { builder, params }) => {
  const nestedQuery = new SelectBuilder(params);
  nestedQuery.from('table2').select('a').where('id', '>', 42);

  builder.from('table1').orWhereAny('a', nestedQuery);
  test.strictSame(
    builder.build(),
    `SELECT * FROM "table1" WHERE "a" = ANY
       (SELECT "a" FROM "table2" WHERE "id" > $1)`.replace(/\n\s+/g, ' ')
  );
  test.strictSame(params.build(), [42]);
});

test.testSync(
  'Select whereAny/orWhereAny nested',
  (test, { builder, params }) => {
    const nestedQuery = new SelectBuilder(params);
    nestedQuery.from('table2').select('a').where('id', '>', 42);

    builder
      .from('table1')
      .whereAny('a', nestedQuery)
      .orWhereAny('b', nestedQuery);
    const expectedSql = `SELECT * FROM "table1" WHERE
       "a" = ANY (SELECT "a" FROM "table2" WHERE "id" > $1)
       OR "b" = ANY (SELECT "a" FROM "table2" WHERE "id" > $2)`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [42, 42]);
  }
);

test.testSync(
  'Select where between nested simple',
  (test, { builder, params }) => {
    const nestedStart = new RawBuilder(() => 'SELECT -1', params);
    const nestedEnd = new RawBuilder(() => 'SELECT 42', params);
    builder
      .from('table1')
      .whereBetween('a', nestedStart, nestedEnd)
      .whereBetween('b', nestedEnd, nestedStart, true);
    const expectedSql = `SELECT * FROM "table1"
     WHERE "a" BETWEEN (SELECT -1) AND (SELECT 42)
       AND "b" BETWEEN SYMMETRIC (SELECT 42) AND (SELECT -1)`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), []);
  }
);

test.testSync(
  'Select where between nested complex',
  (test, { builder, params }) => {
    const nestedStart = new SelectBuilder(params)
      .from('table2')
      .select('f1')
      .where('f2', '>', 42)
      .limit(1);
    const nestedEnd = new SelectBuilder(params)
      .from('table3')
      .select('f1')
      .where('f2', '<', 42)
      .limit(1);
    builder
      .from('table1')
      .whereBetween('a', nestedStart, nestedEnd)
      .whereBetween('b', nestedEnd, nestedStart, true);
    const expectedSql = `SELECT * FROM "table1"
         WHERE "a" BETWEEN
            (SELECT "f1" FROM "table2" WHERE "f2" > $1 LIMIT $2) AND
            (SELECT "f1" FROM "table3" WHERE "f2" < $3 LIMIT $4)
          AND "b" BETWEEN SYMMETRIC
            (SELECT "f1" FROM "table3" WHERE "f2" < $5 LIMIT $6) AND
            (SELECT "f1" FROM "table2" WHERE "f2" > $7 LIMIT $8)`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [42, 1, 42, 1, 42, 1, 42, 1]);
  }
);

test.testSync('Select from with alias', (test, { builder, params }) => {
  builder
    .from('table1')
    .from('table1', 't1')
    .from('table1', 't2')
    .where('table1.f1', '>', 42);
  const expectedSql = `SELECT *
    FROM "table1",
      "table1" AS "t1",
      "table1" AS "t2"
    WHERE "table1"."f1" > $1`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), [42]);
});

test.testSync('Select allowed conditions and', (test, { builder }) => {
  // Must not throw.
  allowedConditions.forEach((cond) => builder.where('f1', cond, 42));
});

test.testSync('Select allowed conditions or', (test, { builder }) => {
  // Must not throw.
  allowedConditions.forEach((cond) => builder.orWhere('f1', cond, 42));
});

test.testSync('Select condition where raw', (test, { builder, params }) => {
  builder
    .from('table2')
    .select('A')
    .whereRaw('"f1" = 52')
    .orWhereRaw(`"f2" < '2023-07-25T17:21:25.333Z'::datetime`);

  const expectedSql = `SELECT "A" FROM "table2" WHERE "f1" = 52 OR "f2" < '2023-07-25T17:21:25.333Z'::datetime`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), []);
});

test.testSync('Select condition where not raw', (test, { builder, params }) => {
  builder
    .from('table2')
    .select('A')
    .whereNotRaw('"f1" = 52')
    .orWhereNotRaw(`"f2" < '2023-07-25T17:21:25.333Z'::datetime`);

  const expectedSql = `SELECT "A" FROM "table2" WHERE NOT "f1" = 52 OR NOT "f2" < '2023-07-25T17:21:25.333Z'::datetime`;
  test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
  test.strictSame(params.build(), []);
});

test.testSync(
  'Select condition where raw function',
  (test, { builder, params }) => {
    const date = new Date().toISOString();

    builder
      .from('table2')
      .select('A')
      .whereRaw((params) => `"f1" = ${params.add(52)}`)
      .orWhereRaw((params) => `"f2" < ${params.add(date)}::datetime`);

    const expectedSql = `SELECT "A" FROM "table2" WHERE "f1" = $1 OR "f2" < $2::datetime`;
    test.strictSame(builder.build(), expectedSql.replace(/\n\s+/g, ' '));
    test.strictSame(params.build(), [52, date]);
  }
);

test.testSync('Select select-nested', (test, { builder, params }) => {
  builder
    .from('table1')
    .select('r1', (n) =>
      n.from('table2').select('A').select().where('f1', '=', 42)
    )
    .where('a', '=', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "r1", (SELECT "A" FROM "table2" WHERE "f1" = $1) FROM "table1" WHERE "a" = $2'
  );
  test.strictSame(params.build(), [42, 42]);
});

test.testSync('Select select-nested-fn as', (test, { builder, params }) => {
  builder
    .from('table1')
    .select('r1')
    .selectAs(
      (n) => n.from('table2').select('A').select().where('f1', '=', 42),
      'r2'
    )
    .where('a', '=', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "r1", (SELECT "A" FROM "table2" WHERE "f1" = $1) AS "r2" FROM "table1" WHERE "a" = $2'
  );
  test.strictSame(params.build(), [42, 42]);
});

test.testSync('Select select nested as', (test, { builder, params }) => {
  builder
    .from('table1')
    .select('r1')
    .selectAs(
      builder.nested().from('table2').select('A').select().where('f1', '=', 42),
      'r2'
    )
    .where('a', '=', 42);
  const query = builder.build();
  test.strictSame(
    query,
    'SELECT "r1", (SELECT "A" FROM "table2" WHERE "f1" = $1) AS "r2" FROM "table1" WHERE "a" = $2'
  );
  test.strictSame(params.build(), [42, 42]);
});

test.testSync('Select fully qualified field', (test, { builder }) => {
  builder
    .select('table1.*')
    .select('table2.name')
    .selectAs('table2.name2', 'n2')
    .from('table1')
    .innerJoin('table2', 'table2.t1id', 'table1.id');
  const query = builder.build();

  test.strictSame(
    query,
    'SELECT "table1".*, "table2"."name", "table2"."name2" AS "n2" FROM "table1" INNER JOIN "table2" ON "table2"."t1id" = "table1"."id"'
  );
});

test.testSync('Select with clause', (test, { builder, params }) => {
  builder
    .with('sub', builder.nested().from('table2').whereEq('a', 42))
    .from('table')
    .whereEq('f1', 3)
    .leftJoin('sub', 'b', 'f2');
  const query = builder.build();
  test.strictSame(
    query,
    'WITH "sub" AS (SELECT * FROM "table2" WHERE "a" = $1) SELECT * FROM "table" LEFT OUTER JOIN "sub" ON "b" = "f2" WHERE "f1" = $2'
  );
  test.strictSame(params.build(), [42, 3]);
});

test.testSync('Select with clause fn', (test, { builder, params }) => {
  builder
    .with('sub', (b) => b.from('table2').whereEq('a', 42))
    .from('table')
    .whereEq('f1', 3)
    .leftJoin('sub', 'b', 'f2');
  const query = builder.build();
  test.strictSame(
    query,
    'WITH "sub" AS (SELECT * FROM "table2" WHERE "a" = $1) SELECT * FROM "table" LEFT OUTER JOIN "sub" ON "b" = "f2" WHERE "f1" = $2'
  );
  test.strictSame(params.build(), [42, 3]);
});

test.testSync(
  'Select with clause fn and nested',
  (test, { builder, params }) => {
    builder
      .with('sub', (b) => b.from('table2').whereEq('a', 42))
      .from('table')
      .whereIn('f1', builder.nested().from('sub'));
    const query = builder.build();
    test.strictSame(
      query,
      'WITH "sub" AS (SELECT * FROM "table2" WHERE "a" = $1) SELECT * FROM "table" WHERE "f1" IN (SELECT * FROM "sub")'
    );
    test.strictSame(params.build(), [42]);
  }
);

test.testSync(
  'Select with clause fn and nested',
  (test, { builder, params }) => {
    builder
      .with(builder.raw('sub(b)'), (b) => b.from('table2').whereEq('a', 42))
      .from('table')
      .whereIn('f1', builder.nested().from('sub'));
    const query = builder.build();
    test.strictSame(
      query,
      'WITH sub(b) AS (SELECT * FROM "table2" WHERE "a" = $1) SELECT * FROM "table" WHERE "f1" IN (SELECT * FROM "sub")'
    );
    test.strictSame(params.build(), [42]);
  }
);
