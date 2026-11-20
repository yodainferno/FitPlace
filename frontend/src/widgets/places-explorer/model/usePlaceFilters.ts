'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { updateSearchParams } from '@/src/shared/lib';
import {
  DEFAULT_PLACE_FILTERS,
  getPlaceFilterParams,
  readPlaceFilters,
  type PlaceFilters,
} from './place-filters';

export function usePlaceFilters(categories: readonly string[]) {
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => readPlaceFilters(searchParams, categories),
    [searchParams, categories],
  );

  function setFilters(value: PlaceFilters) {
    const previousParams = getPlaceFilterParams(filters);
    const nextParams = getPlaceFilterParams(value);
    const onlyQueryChanged =
      value.query !== filters.query &&
      nextParams.category === previousParams.category &&
      nextParams.recommendations === previousParams.recommendations;

    updateSearchParams(nextParams, onlyQueryChanged ? 'replace' : 'push');
  }

  function resetFilters() {
    updateSearchParams(getPlaceFilterParams(DEFAULT_PLACE_FILTERS));
  }

  return { filters, setFilters, resetFilters };
}
