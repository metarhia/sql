import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';
import { SqlTemplate } from './raw-builder';

export interface ConditionsBuilderOptions extends QueryBuilderOptions {}

type QueryValue = QueryBuilder | ((builder: ConditionsBuilder) => QueryBuilder);

type ConditionValue = any | QueryBuilder;

export class ConditionsBuilder extends QueryBuilder<ConditionsBuilderOptions> {
  constructor(params: ParamsBuilder, options?: ConditionsBuilderOptions);

  and(key: string, cond: string, value: ConditionValue): this;
  and(key: QueryValue): this;
  andConds(conds: QueryValue): this;

  andKey(leftKey: string, cond: string, rightKey: string): this;
  andRaw(sql: SqlTemplate): this;

  or(key: string, cond: string, value: ConditionValue): this;
  or(key: QueryValue): this;
  orConds(conds: QueryValue): this;

  orKey(leftKey: string, cond: string, rightKey: string): this;
  orRaw(sql: SqlTemplate): this;

  not(key: string, cond: string, value: ConditionValue): this;
  notKey(leftKey: string, cond: string, rightKey: string): this;
  notRaw(sql: SqlTemplate): this;

  orNot(key: string, cond: string, value: ConditionValue): this;
  orNotKey(leftKey: string, cond: string, rightKey: string): this;
  orNotRaw(sql: SqlTemplate): this;

  null(key: string): this;

  orNull(key: string): this;

  notNull(key: string): this;

  orNotNull(key: string): this;

  between(
    key: string,
    from: ConditionValue,
    to: ConditionValue,
    symmetric?: boolean
  ): this;

  orBetween(
    key: string,
    from: ConditionValue,
    to: ConditionValue,
    symmetric?: boolean
  ): this;

  notBetween(
    key: string,
    from: ConditionValue,
    to: ConditionValue,
    symmetric?: boolean
  ): this;

  orNotBetween(
    key: string,
    from: ConditionValue,
    to: ConditionValue,
    symmetric?: boolean
  ): this;

  in(key: string, conds: Iterable<any> | QueryBuilder): this;

  orIn(key: string, conds: Iterable<any> | QueryBuilder): this;

  notIn(key: string, conds: Iterable<any> | QueryBuilder): this;

  orNotIn(key: string, conds: Iterable<any> | QueryBuilder): this;

  any(key: string, value: ConditionValue): this;

  orAny(key: string, value: ConditionValue): this;

  exists(subquery: QueryBuilder): this;

  orExists(subquery: QueryBuilder): this;
}
