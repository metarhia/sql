import { ParamsBuilder } from './params-builder';
import { SelectQueryValue } from './select-builder';
import { QueryBuilder } from './query-builder';

export interface QueryBuilderOptions {
  escapeIdentifier?: (key: string) => string;
}

// Utility class for all proxy Conditions methods.
export class QueryConditionsBuilder<
  O extends QueryBuilderOptions = QueryBuilderOptions,
  CV = unknown,
> extends QueryBuilder<O> {
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

  whereBetween(key: string, from: CV, to: CV, symmetric?: boolean): this;

  orWhereBetween(key: string, from: CV, to: CV, symmetric?: boolean): this;

  whereNotBetween(key: string, from: CV, to: CV, symmetric?: boolean): this;

  orWhereNotBetween(key: string, from: CV, to: CV, symmetric?: boolean): this;

  whereIn(key: string, conds: Iterable<any> | SelectQueryValue): this;

  orWhereIn(key: string, conds: Iterable<any> | SelectQueryValue): this;

  whereNotIn(key: string, conds: Iterable<any> | SelectQueryValue): this;

  orWhereNotIn(key: string, conds: Iterable<any> | SelectQueryValue): this;

  whereAny(key: string, value: CV): this;

  orWhereAny(key: string, value: CV): this;

  whereExists(subquery: SelectQueryValue): this;

  orWhereExists(subquery: SelectQueryValue): this;

  // Build and return the SQL query.
  build(): string;
}
