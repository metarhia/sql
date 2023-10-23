import { ParamsBuilder } from './params-builder';
import { QueryBuilderOptions } from './query-builder';
import { QueryConditionsBuilder } from './query-conditions-builder';
import { SelectConditionValue } from './select-builder';

export interface UpdateBuilderOptions extends QueryBuilderOptions {}

export class UpdateBuilder extends QueryConditionsBuilder<
  UpdateBuilderOptions,
  SelectConditionValue
> {
  constructor(params: ParamsBuilder, options?: UpdateBuilderOptions);

  table(tableName: string, alias?: string): this;

  from(tableName: string, alias?: string): this;

  set(key: string, value: SelectConditionValue): this;

  sets<T extends object>(obj: T): this;
}
