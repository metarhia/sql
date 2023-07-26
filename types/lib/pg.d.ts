import { PostgresParamsBuilder } from './pg-params-builder';
import { SelectBuilder } from './select-builder';
import { PgInsertBuilder } from './pg-insert-builder';
import { UpdateBuilder } from './update-builder';
import { DeleteBuilder } from './delete-builder';

export const pg: (
  handler: (builder: SelectBuilder, params: PostgresParamsBuilder) => void
) => {
  builder: SelectBuilder;
  params: PostgresParamsBuilder;
};

export const pgQuerySelect: <T>(
  pg: { query: (query: string, params: unknown[]) => Promise<T> },
  handler: (builder: SelectBuilder, params: PostgresParamsBuilder) => void
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
