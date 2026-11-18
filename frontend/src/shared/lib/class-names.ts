type ClassNameValue =
  | string
  | false
  | null
  | undefined
  | Record<string, boolean | null | undefined>;

export function classNames(...values: ClassNameValue[]): string {
  return values
    .flatMap((value) => {
      if (!value) return [];
      if (typeof value === 'string') return [value];

      return Object.entries(value)
        .filter(([, enabled]) => enabled)
        .map(([className]) => className);
    })
    .join(' ');
}
