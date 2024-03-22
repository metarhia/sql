import { SelectBuilder, SelectQueryValue } from './select-builder';
import { QueryBuilder, QueryValue } from './query-builder';

export type PgSelectConditionValue =
  | QueryBuilder
  | ((builder: PgSelectBuilder) => QueryBuilder)
  | QueryValue;

export type PgSelectQueryValue =
  | QueryBuilder
  | ((builder: PgSelectBuilder) => QueryBuilder);

export class PgSelectBuilder extends SelectBuilder<PgSelectConditionValue> {
  with(alias: string, sql: PgSelectQueryValue): this;

  distinctOn(keyOrExpr: string | '*' | QueryBuilder): this;
}
