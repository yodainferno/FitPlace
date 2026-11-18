const CATEGORY_LABELS: Record<string, string> = {
  workout: 'Воркаут',
  running: 'Бег',
  cycling: 'Велосипед',
  climbing: 'Скалолазание',
};

export function getPlaceCategoryLabel(category?: string): string {
  return category ? (CATEGORY_LABELS[category] ?? category) : 'Без категории';
}
