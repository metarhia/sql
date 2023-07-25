import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';
import { QueryConditionsBuilder } from './query-conditions-builder';

export interface SelectBuilderOptions extends QueryBuilderOptions {}

export type SelectQueryValue =
  | QueryBuilder
  | ((builder: SelectBuilder) => QueryBuilder);

export type SelectConditionValue = any | SelectQueryValue;

export class SelectBuilder extends QueryConditionsBuilder<
  SelectBuilderOptions,
  SelectConditionValue
> {
  constructor(params: ParamsBuilder, options?: SelectBuilderOptions);

  from(tableName: string, alias?: string): this;

  select(...fields: string[]): this;

  selectAs(field: string, alias: string): this;

  innerJoin(tableName: string, leftKey: string, rightKey: string): this;

  distinct(): this;

  orderBy(field: string, dir?: 'ASC' | 'DESC'): this;

  groupBy(...field: string[]): this;

  limit(limit: number): this;

  offset(offset: number): this;

  count(field?: string, alias?: string): this;

  avg(field: string, alias?: string): this;

  min(field: string, alias?: string): this;

  max(field: string, alias?: string): this;

  sum(field: string, alias?: string): this;
}
