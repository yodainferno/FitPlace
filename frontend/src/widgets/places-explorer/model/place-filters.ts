import { z } from 'zod';
import {
  PLACE_RECOMMENDATION_LEVELS,
  PlaceRecommendation,
  type PublishedPlace,
} from '@/src/entities/place';
import { parseQueryArray } from '@/src/shared/lib';

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

const recommendationParamSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .pipe(z.enum(PlaceRecommendation));

export function readRecommendations(
  raw: string | null,
): PlaceFilters['recommendations'] {
  return parseQueryArray(
    raw,
    recommendationParamSchema,
    DEFAULT_PLACE_FILTERS.recommendations,
  );
}

export function readPlaceFilters(
  params: Pick<URLSearchParams, 'get'>,
  categories: readonly string[],
): PlaceFilters {
  const category = params.get('category') ?? '';

  return {
    query: params.get('query') ?? DEFAULT_PLACE_FILTERS.query,
    category: categories.includes(category) ? category : '',
    recommendations: readRecommendations(params.get('recommendations')),
  };
}

export function getPlaceFilterParams(
  filters: PlaceFilters,
): Record<string, string | null> {
  const allRecommendations = PLACE_RECOMMENDATION_LEVELS.every((level) =>
    filters.recommendations.includes(level),
  );

  return {
    query: filters.query || null,
    category: filters.category || null,
    recommendations: allRecommendations
      ? null
      : [...filters.recommendations].sort((a, b) => a - b).join('_'),
  };
}

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
