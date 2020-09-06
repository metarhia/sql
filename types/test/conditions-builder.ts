import { ParamsBuilder } from '../lib/params-builder';
import { QueryBuilder } from '../lib/query-builder';
import { ConditionsBuilder } from '../lib/conditions-builder';

const anotherQuery: QueryBuilder = {} as QueryBuilder;

const queryBuilderFn = (select: ConditionsBuilder): QueryBuilder => select;

const params = new ParamsBuilder();
const builder: ConditionsBuilder = new ConditionsBuilder(params);

const sql = builder
  .and('key', '>', 42)
  .or('key', '>', 42)
  .and('key', '>', anotherQuery)
  .or('key', '>', anotherQuery)
  .andConds(anotherQuery)
  .orConds(anotherQuery)
  .andConds(queryBuilderFn)
  .orConds(queryBuilderFn)
  .not('keynot', '<', 42)
  .orNot('keynot', '<', 42)
  .not('keynot', '<', anotherQuery)
  .orNot('keynot', '<', anotherQuery)
  .null('keynull')
  .orNull('keynull')
  .notNull('keynotnull')
  .orNotNull('keynotnull')
  .between('keybetween', 1, 100)
  .orBetween('keybetween', 1, 100)
  .between('keybetween', 1, 100, true)
  .orBetween('keybetween', 1, 100, true)
  .notBetween('keynotbetween', 1, 100)
  .orNotBetween('keynotbetween', 1, 100)
  .notBetween('keynotbetween', 1, 100, true)
  .orNotBetween('keynotbetween', 1, 100, true)
  .between('keybetween', anotherQuery, anotherQuery)
  .orBetween('keybetween', anotherQuery, anotherQuery)
  .between('keybetween', anotherQuery, anotherQuery, true)
  .orBetween('keybetween', anotherQuery, anotherQuery, true)
  .notBetween('keynotbetween', anotherQuery, anotherQuery)
  .orNotBetween('keynotbetween', anotherQuery, anotherQuery)
  .notBetween('keynotbetween', anotherQuery, anotherQuery, true)
  .orNotBetween('keynotbetween', anotherQuery, anotherQuery, true)
  .in('keyin', [1, 2, 3])
  .orIn('keyin', [1, 2, 3])
  .in('keyin', new Set([1, 2, 3]))
  .orIn('keyin', new Set([1, 2, 3]))
  .in('keyin', anotherQuery)
  .orIn('keyin', anotherQuery)
  .notIn('keynotin', [1, 2, 3])
  .orNotIn('keynotin', [1, 2, 3])
  .notIn('keynotin', new Set([1, 2, 3]))
  .orNotIn('keynotin', new Set([1, 2, 3]))
  .notIn('keynotin', anotherQuery)
  .orNotIn('keynotin', anotherQuery)
  .any('keyany', [1, 2, 3])
  .orAny('keyany', [1, 2, 3])
  .any('keyany', new Set([1, 2, 3]))
  .orAny('keyany', new Set([1, 2, 3]))
  .any('keyany', anotherQuery)
  .orAny('keyany', anotherQuery)
  .exists(anotherQuery)
  .orExists(anotherQuery)
  .build();

const p: any[] = params.build();
