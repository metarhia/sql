import { SelectBuilder } from './select-builder';
import { QueryBuilder } from './query-builder';

export type PgSelectQueryValue =
  | QueryBuilder
  | ((builder: PgSelectBuilder) => QueryBuilder);

export type PgSelectConditionValue = unknown | PgSelectQueryValue;

export class PgSelectBuilder extends SelectBuilder<PgSelectConditionValue> {
  distinctOn(keyOrExpr: string | '*' | QueryBuilder): this;
}
