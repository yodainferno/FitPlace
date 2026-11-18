import {
  PLACE_RECOMMENDATION_LEVELS,
  type PlaceRecommendation,
  type PublishedPlace,
} from '@/src/entities/place';

export type PlaceFilters = {
  query: string;
  category: string;
  recommendations: readonly PlaceRecommendation[];
};

export const DEFAULT_PLACE_FILTERS: PlaceFilters = {
  query: '',
  category: '',
  recommendations: PLACE_RECOMMENDATION_LEVELS,
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
    const matchesRecommendation = filters.recommendations.includes(
      place.recommendation,
    );

    return (
      (!query || text.includes(query)) &&
      (!filters.category || place.category === filters.category) &&
      matchesRecommendation
    );
  });
}
