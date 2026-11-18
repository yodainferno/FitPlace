import type { Place } from './types/place';

const CATEGORY_LABELS: Record<string, string> = {
  workout: 'Воркаут',
  running: 'Бег',
  cycling: 'Велосипед',
  climbing: 'Скалолазание',
};

const RATING_LABELS = {
  0: 'Без звёзд',
  1: 'Стоит посетить',
  2: 'Стоит изменить маршрут',
  3: 'Стоит поехать ради этого места',
};

export function getPlaceCategoryLabel(category?: string): string {
  return category ? (CATEGORY_LABELS[category] ?? category) : 'Без категории';
}

export function getPlaceRatingLabel(rate: Place['rate']): string {
  return RATING_LABELS[rate ?? 0];
}
