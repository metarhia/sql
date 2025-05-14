export function escapeIdentifier(name: string): string;

export function pgEscapeIdentifier(name: string): string;

export function escapeKey(
  key: string,
  escapeIdentifier: (id: string) => string
): string;

export function mapJoinIterable<T>(
  val: Iterable<T>,
  mapper: (val: T) => string,
  sep: string
): string;

export function joinIterable<T>(val: Iterable<T>, sep: string): string;
