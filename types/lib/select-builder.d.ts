import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions, QueryValue } from './query-builder';
import { QueryConditionsBuilder } from './query-conditions-builder';

export interface SelectBuilderOptions extends QueryBuilderOptions {}

export type SelectQueryValue =
  | QueryBuilder
  | ((builder: SelectBuilder) => QueryBuilder);

export type SelectConditionValue = QueryValue | SelectQueryValue;

export type JoinKind =
  | 'INNER'
  | 'LEFT OUTER'
  | 'RIGHT OUTER'
  | 'FULL OUTER'
  | 'NATURAL'
  | 'CROSS';

export class SelectBuilder<
  CV = SelectConditionValue,
> extends QueryConditionsBuilder<SelectBuilderOptions, CV> {
  constructor(params: ParamsBuilder, options?: SelectBuilderOptions);

  from(tableName: string, alias?: string): this;

  with(alias: string | QueryBuilder, sql: SelectQueryValue): this;

  select(...fields: Array<string | CV>): this;

  selectAs(field: string | CV, alias: string): this;

  selectFn(fn: string, field: string | CV, alias: string): this;

  selectRaw(sql: string | CV): this;

  innerJoin(tableName: string, leftKey: string, rightKey: string): this;

  innerJoinAs(
    tableName: string,
    alias: string,
    leftKey: string,
    rightKey: string
  ): this;

  innerJoinCond(tableName: string, condition: QueryBuilder | string): this;

  innerJoinCondAs(
    tableName: string,
    alias: string,
    condition: QueryBuilder | string
  ): this;

  leftJoin(tableName: string, leftKey: string, rightKey: string): this;

  leftJoinAs(
    tableName: string,
    alias: string,
    leftKey: string,
    rightKey: string
  ): this;

  leftJoinCond(tableName: string, condition: QueryBuilder | string): this;

  leftJoinCondAs(
    tableName: string,
    alias: string,
    condition: QueryBuilder | string
  ): this;

  rightJoin(tableName: string, leftKey: string, rightKey: string): this;

  rightJoinAs(
    tableName: string,
    alias: string,
    leftKey: string,
    rightKey: string
  ): this;

  rightJoinCond(tableName: string, condition: QueryBuilder | string): this;

  rightJoinCondAs(
    tableName: string,
    alias: string,
    condition: QueryBuilder | string
  ): this;

  fullJoin(tableName: string, leftKey: string, rightKey: string): this;

  fullJoinAs(
    tableName: string,
    alias: string,
    leftKey: string,
    rightKey: string
  ): this;

  fullJoinCond(tableName: string, condition: QueryBuilder | string): this;

  fullJoinCondAs(
    tableName: string,
    alias: string,
    condition: QueryBuilder | string
  ): this;

  naturalJoin(tableName: string): this;

  naturalJoinAs(tableName: string, alias: string): this;

  crossJoin(tableName: string): this;

  crossJoinAs(tableName: string, alias: string): this;

  join(
    kind: JoinKind,
    tableName: string,
    alias: string,
    leftKey: string,
    rightKey: string
  ): this;

  joinCond(
    kind: JoinKind,
    tableName: string,
    alias: string,
    condition: QueryBuilder | string
  ): this;

  distinct(): this;

  orderBy(field: string, dir?: 'ASC' | 'DESC'): this;

  orderByRaw(raw: QueryBuilder | string): this;

  groupBy(...field: string[]): this;

  groupByRaw(raw: QueryBuilder | string): this;

  limit(limit: number): this;

  offset(offset: number): this;

  count(field?: string, alias?: string): this;

  countOver(field?: string, alias?: string): this;

  avg(field: string, alias?: string): this;

  min(field: string, alias?: string): this;

  max(field: string, alias?: string): this;

  sum(field: string, alias?: string): this;
}
