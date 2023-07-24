import { ParamsBuilder } from './params-builder';
import { QueryValue } from './select-builder';

export interface QueryBuilderOptions {
  escapeIdentifier?: (key: string) => string;
}


// Utility class for all proxy Conditions methods.
export class QueryConditionsBuilder<O extends QueryBuilderOptions = QueryBuilderOptions, CV = unknown> {
  constructor(params: ParamsBuilder, options?: O);

  where(key: string, cond: string, value: CV): this;

  whereEq(key: string, value: CV): this;

  whereMore(key: string, value: CV): this;

  whereMoreEq(key: string, value: CV): this;

  whereLess(key: string, value: CV): this;

  whereLessEq(key: string, value: CV): this;

  orWhere(key: string, cond: string, value: CV): this;

  whereNot(key: string, cond: string, value: CV): this;

  orWhereNot(key: string, cond: string, value: CV): this;

  whereNull(key: string): this;

  orWhereNull(key: string): this;

  whereNotNull(key: string): this;

  orWhereNotNull(key: string): this;

  whereBetween(
    key: string,
    from: CV,
    to: CV,
    symmetric?: boolean
  ): this;

  orWhereBetween(
    key: string,
    from: CV,
    to: CV,
    symmetric?: boolean
  ): this;

  whereNotBetween(
    key: string,
    from: CV,
    to: CV,
    symmetric?: boolean
  ): this;

  orWhereNotBetween(
    key: string,
    from: CV,
    to: CV,
    symmetric?: boolean
  ): this;

  whereIn(key: string, conds: Iterable<any> | QueryValue): this;

  orWhereIn(key: string, conds: Iterable<any> | QueryValue): this;

  whereNotIn(key: string, conds: Iterable<any> | QueryValue): this;

  orWhereNotIn(key: string, conds: Iterable<any> | QueryValue): this;

  whereAny(key: string, value: CV): this;

  orWhereAny(key: string, value: CV): this;

  whereExists(subquery: QueryValue): this;

  orWhereExists(subquery: QueryValue): this;

  // Build and return the SQL query.
  build(): string;
}
