import { SelectBuilder } from './select-builder';
import { QueryBuilder } from './query-builder';

export class PgSelectBuilder extends SelectBuilder {
  distinctOn(keyOrExpr: string | '*' | QueryBuilder): this;
}
