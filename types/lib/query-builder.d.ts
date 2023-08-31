import { ParamsBuilder } from './params-builder';

export interface QueryBuilderOptions {
  escapeIdentifier?: (key: string) => string;
}

// Base class for all QueryBuilders
export class QueryBuilder<O extends QueryBuilderOptions = QueryBuilderOptions> {
  constructor(params: ParamsBuilder, options?: O);

  makeParamValue(value: unknown | QueryBuilder): string;

  makeKeyOrExpr(value: string | QueryBuilder): string;

  raw(sqlTemplate: SqlTemplate): RawBuilder;

  // Build and return the SQL query.
  build(): string;

  buildParams(): unknown[];
}

export type SqlTemplate = string | ((p: ParamsBuilder) => string);

export class RawBuilder extends QueryBuilder {
  constructor(
    sqlTemplate: SqlTemplate,
    params: ParamsBuilder,
    options?: QueryBuilderOptions
  );
}
