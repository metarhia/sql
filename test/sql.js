'use strict';

const { testSync } = require('metatests');
const { pg } = require('..');

testSync('Must correctly export pg utility', (test) => {
  const builder = pg();
  builder.select('f1').from('table1').where('f2', '=', 42);
  test.strictEqual(
    builder.build(),
    'SELECT "f1" FROM "table1" WHERE "f2" = $1'
  );
  test.strictEqual(builder.buildParams(), [42]);
});
