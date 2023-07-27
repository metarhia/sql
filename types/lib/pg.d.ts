import { PostgresParamsBuilder } from './pg-params-builder';
import { SelectBuilder } from './select-builder';
import { PgInsertBuilder } from './pg-insert-builder';
import { UpdateBuilder } from './update-builder';
import { DeleteBuilder } from './delete-builder';
import { PgSelectBuilder } from './pg-select-builder';

export const pg: typeof pgSelect;

export const pgSelect: <T>(
  handler?: (builder: PgSelectBuilder, params: PostgresParamsBuilder) => void
) => PgSelectBuilder;

export const pgInsert: <T>(
  handler?: (builder: PgInsertBuilder, params: PostgresParamsBuilder) => void
) => PgInsertBuilder;

export const pgUpdate: <T>(
  handler?: (builder: UpdateBuilder, params: PostgresParamsBuilder) => void
) => UpdateBuilder;

export const pgDelete: <T>(
  handler?: (builder: DeleteBuilder, params: PostgresParamsBuilder) => void
) => DeleteBuilder;

export const pgQuerySelect: <T>(
  handler?: (builder: PgSelectBuilder, params: PostgresParamsBuilder) => void
) => Promise<T>;

export const pgQueryInsert: <T>(
  pg: { query: (query: string, params: unknown[]) => Promise<T> },
  handler: (builder: PgInsertBuilder, params: PostgresParamsBuilder) => void
) => Promise<T>;

export const pgQueryUpdate: <T>(
  pg: { query: (query: string, params: unknown[]) => Promise<T> },
  handler: (builder: UpdateBuilder, params: PostgresParamsBuilder) => void
) => Promise<T>;

export const pgQueryDelete: <T>(
  pg: { query: (query: string, params: unknown[]) => Promise<T> },
  handler: (builder: DeleteBuilder, params: PostgresParamsBuilder) => void
) => Promise<T>;
