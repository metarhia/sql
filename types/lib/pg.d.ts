import { PostgresParamsBuilder } from './pg-params-builder';
import { SelectBuilderOptions } from './select-builder';
import { PgInsertBuilder } from './pg-insert-builder';
import { UpdateBuilder, UpdateBuilderOptions } from './update-builder';
import { DeleteBuilder, DeleteBuilderOptions } from './delete-builder';
import { PgSelectBuilder } from './pg-select-builder';
import { InsertBuilderOptions } from './insert-builder';

export const pg: typeof pgSelect;

export const pgSelect: (options?: SelectBuilderOptions) => PgSelectBuilder;

export const pgInsert: (options?: InsertBuilderOptions) => PgInsertBuilder;

export const pgUpdate: (options?: UpdateBuilderOptions) => UpdateBuilder;

export const pgDelete: (options?: DeleteBuilderOptions) => DeleteBuilder;

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
