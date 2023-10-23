import { SelectBuilder } from './select-builder';
import { QueryBuilder, QueryValue } from './query-builder';

export type PgSelectConditionValue =
  | QueryBuilder
  | ((builder: PgSelectBuilder) => QueryBuilder)
  | QueryValue;

export class PgSelectBuilder extends SelectBuilder<PgSelectConditionValue> {
  distinctOn(keyOrExpr: string | '*' | QueryBuilder): this;
}
