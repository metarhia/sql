import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions, QueryValue } from './query-builder';
import { QueryConditionsBuilder } from './query-conditions-builder';
import { SelectConditionValue } from './select-builder';

export interface DeleteBuilderOptions extends QueryBuilderOptions {}

export class DeleteBuilder extends QueryConditionsBuilder<
  DeleteBuilderOptions,
  SelectConditionValue
> {
  constructor(params: ParamsBuilder, options?: DeleteBuilderOptions);

  from(tableName: string, alias?: string): this;
}
