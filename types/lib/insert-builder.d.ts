import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';
import { SelectConditionValue } from './select-builder';

export interface InsertBuilderOptions extends QueryBuilderOptions {}

export class InsertBuilder extends QueryBuilder<InsertBuilderOptions> {
  constructor(params: ParamsBuilder, options?: InsertBuilderOptions);

  table(tableName: string, alias?: string): this;

  value(key: string, value: SelectConditionValue): this;

  values(obj: Record<string, SelectConditionValue>): this;
}
