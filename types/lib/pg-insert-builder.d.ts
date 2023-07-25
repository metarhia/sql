import { QueryBuilder } from './query-builder';
import { InsertBuilder } from './insert-builder';

export class PgInsertBuilder extends InsertBuilder {
  returning(key: string | '*' | QueryBuilder, alias?: string): this;

  conflict(target: string | null | undefined, action: string): this;
}
