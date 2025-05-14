import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';
import { QueryConditionsBuilder } from './query-conditions-builder';
import {
  SelectBuilder,
  SelectConditionValue,
  SelectQueryValue,
} from './select-builder';

export interface UpdateBuilderOptions extends QueryBuilderOptions {}

export class UpdateBuilder extends QueryConditionsBuilder<
  UpdateBuilderOptions,
  SelectConditionValue
> {
  constructor(params: ParamsBuilder, options?: UpdateBuilderOptions);

  table(tableName: string, alias?: string): this;

  from(tableName: string, alias?: string): this;

  fromSelect(sql: SelectConditionValue, alias?: string): this;

  set(key: string, value: SelectConditionValue): this;

  sets<T extends object>(obj: T): this;

  with(alias: string | QueryBuilder, sql: SelectQueryValue): this;

  select(): SelectBuilder;

  returning(key: string | '*' | QueryBuilder, alias?: string): this;

  isNotEmpty(): boolean;
}
