import { ParamsBuilder } from './params-builder';
import { QueryBuilder, QueryBuilderOptions } from './query-builder';

export type SqlTemplate = string | ((p: ParamsBuilder) => string);

export class RawBuilder extends QueryBuilder {
  constructor(
    sqlTemplate: SqlTemplate,
    params: ParamsBuilder,
    options?: QueryBuilderOptions
  );
}
