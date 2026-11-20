'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { updateSearchParams } from '@/src/shared/lib';
import {
  getMapViewParams,
  readMapViewState,
  type MapViewState,
} from './map-view-state';

export function usePlaceMapView() {
  const searchParams = useSearchParams();
  const mapView = useMemo(() => readMapViewState(searchParams), [searchParams]);

  const setMapView = useCallback((view: MapViewState) => {
    updateSearchParams(getMapViewParams(view), 'replace');
  }, []);

  return { mapView, setMapView };
}
