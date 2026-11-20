export function updateSearchParams(
  values: Record<string, string | null>,
  mode: 'push' | 'replace' = 'push',
): void {
  const url = new URL(window.location.href);

  Object.entries(values).forEach(([key, value]) => {
    if (value === null) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
  });

  if (url.href === window.location.href) return;

  if (mode === 'replace') window.history.replaceState(null, '', url);
  else window.history.pushState(null, '', url);
}
