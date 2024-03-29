import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';
import {
  SelectBuilder,
  SelectConditionValue,
  SelectQueryValue,
} from './select-builder';

export interface InsertBuilderOptions extends QueryBuilderOptions {}

export class InsertBuilder extends QueryBuilder<InsertBuilderOptions> {
  constructor(params: ParamsBuilder, options?: InsertBuilderOptions);

  table(tableName: string, alias?: string): this;

  value(key: string, value: SelectConditionValue): this;

  values<T extends object>(obj: T): this;

  with(alias: string | QueryBuilder, sql: SelectQueryValue): this;

  from(sql: SelectQueryValue): this;

  select(): SelectBuilder;
}
