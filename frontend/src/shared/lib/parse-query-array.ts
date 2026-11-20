import type { z } from 'zod';

export function parseQueryArray<S extends z.ZodType>(
  raw: string | null,
  itemSchema: S,
  fallback: readonly z.output<S>[],
): readonly z.output<S>[] {
  if (raw === null) return fallback;

  const values = raw.split('_').flatMap((value) => {
    const result = itemSchema.safeParse(value);
    return result.success ? [result.data] : [];
  });

  return [...new Set(values)];
}
