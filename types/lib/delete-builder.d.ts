import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';
import { QueryConditionsBuilder } from './query-conditions-builder';
import { SelectBuilder } from './select-builder';

export interface DeleteBuilderOptions extends QueryBuilderOptions {}

export type QueryValue =
  | QueryBuilder
  | ((builder: SelectBuilder) => QueryBuilder);

export type ConditionValue = any | QueryValue;

export class DeleteBuilder extends QueryConditionsBuilder<
  DeleteBuilderOptions,
  ConditionValue
> {
  constructor(params: ParamsBuilder, options?: DeleteBuilderOptions);

  from(tableName: string, alias?: string): this;
}
