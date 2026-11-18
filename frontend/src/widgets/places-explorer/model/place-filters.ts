import type { PublishedPlace } from '@/src/entities/place';

export type PlaceFilters = {
  query: string;
  category: string;
  rating: string;
};

export const DEFAULT_PLACE_FILTERS: PlaceFilters = {
  query: '',
  category: '',
  rating: '',
};

export function filterPlaces(
  places: PublishedPlace[],
  filters: PlaceFilters,
): PublishedPlace[] {
  const query = filters.query.trim().toLocaleLowerCase('ru');

  return places.filter((place) => {
    const text = `${place.name} ${place.location.address}`.toLocaleLowerCase(
      'ru',
    );
    const rate = place.rate ?? 0;
    const matchesRating =
      !filters.rating ||
      (filters.rating === 'unrated'
        ? rate === 0
        : rate >= Number(filters.rating));

    return (
      (!query || text.includes(query)) &&
      (!filters.category || place.category === filters.category) &&
      matchesRating
    );
  });
}
