import { ParamsBuilder } from './params-builder';

export type QueryValue =
  | string
  | number
  | boolean
  | Date
  | null
  | QueryValue[]
  | Set<QueryValue>;

export interface QueryBuilderOptions {
  escapeIdentifier?: (key: string) => string;
}

// Base class for all QueryBuilders
export class QueryBuilder<O extends QueryBuilderOptions = QueryBuilderOptions> {
  public params: ParamsBuilder;

  constructor(params: ParamsBuilder, options?: O);

  makeParamValue(value: unknown | QueryBuilder): string;

  makeKeyOrExpr(value: string | QueryBuilder): string;

  raw(sqlTemplate: SqlTemplate): RawBuilder;

  key(key: string): RawBuilder;

  nested(): this;

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
