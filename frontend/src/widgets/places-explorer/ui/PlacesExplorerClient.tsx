'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import {
  AlertCircle,
  ListFilter,
  MapPinOff,
  PanelLeftClose,
  RotateCcw,
} from 'lucide-react';
import {
  getPlaceCategoryLabel,
  PlaceCard,
  PLACE_RECOMMENDATION_LEVELS,
  type PlaceOnMap,
  type PublishedPlace,
} from '@/src/entities/place';
import { IconButton } from '@/src/shared/ui/IconButton';
import { DEFAULT_PLACE_FILTERS, filterPlaces } from '../model/place-filters';
import type { MapFocusRequest } from '../model/map-focus-request';
import { PlaceFilters } from './PlaceFilters';
import { PlaceDetailsDialog } from './PlaceDetailsDialog';

const PlacesMap = dynamic(() => import('./PlacesMap'), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 grid place-items-center text-muted-foreground"
      role="status"
    >
      Загружаем карту...
    </div>
  ),
});

type PlacesExplorerClientProps = {
  places: PublishedPlace[];
  hasLoadError?: boolean;
};

export function PlacesExplorerClient({
  places,
  hasLoadError = false,
}: PlacesExplorerClientProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [mapFocusRequest, setMapFocusRequest] =
    useState<MapFocusRequest | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_PLACE_FILTERS);

  const categories = useMemo(
    () =>
      [
        ...new Set(
          places
            .map((place) => place.category)
            .filter((category): category is string => Boolean(category)),
        ),
      ].sort((a, b) =>
        getPlaceCategoryLabel(a).localeCompare(getPlaceCategoryLabel(b), 'ru'),
      ),
    [places],
  );
  const filteredPlaces = useMemo(
    () => filterPlaces(places, filters),
    [places, filters],
  );
  const placesOnMap = useMemo<PlaceOnMap[]>(
    () =>
      filteredPlaces.map((place) => ({
        ...place,
        highlight: place.id === selectedPlaceId,
      })),
    [filteredPlaces, selectedPlaceId],
  );
  const selectedPlace = places.find((place) => place.id === selectedPlaceId);
  const hasFilters = Boolean(
    filters.query ||
    filters.category ||
    filters.recommendations.length !== PLACE_RECOMMENDATION_LEVELS.length,
  );
  const openPlace = (place: PlaceOnMap) => setSelectedPlaceId(place.id);
  const openPlaceFromList = (place: PlaceOnMap) => {
    setMapFocusRequest({ location: place.location, isSidebarOpen });
    openPlace(place);
  };

  return (
    <main
      className="relative h-dvh w-full overflow-hidden bg-surface text-foreground"
      lang="ru"
    >
      <PlacesMap
        places={placesOnMap}
        onClickPlace={openPlace}
        isSidebarOpen={isSidebarOpen}
        focusRequest={mapFocusRequest}
      />
      {isSidebarOpen ? (
        <aside
          id="places-sidebar"
          className="absolute inset-x-3 bottom-3 z-2 h-[52dvh] overflow-y-auto overscroll-contain rounded-lg border border-border bg-background shadow-panel map:inset-y-4 map:right-auto map:left-4 map:flex map:h-auto map:w-90 map:flex-col map:overflow-hidden"
          aria-label="Места и фильтры"
        >
          <header className="sticky top-0 z-1 flex shrink-0 items-center gap-2.5 border-b border-border bg-background px-3.5 py-3 map:static map:p-4">
            <h1 className="mr-auto">
              <Image
                src="/brand/fitplace-logo.svg"
                alt="Fitplace"
                width={160}
                height={43}
                className="h-auto w-40"
              />
            </h1>
            <IconButton
              label="Скрыть список мест"
              aria-expanded={true}
              aria-controls="places-sidebar"
              onClick={() => setIsSidebarOpen(false)}
            >
              <PanelLeftClose size={19} aria-hidden="true" />
            </IconButton>
          </header>
          <PlaceFilters
            categories={categories}
            value={filters}
            onChange={setFilters}
          />
          <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
            <h2 className="text-[13px] font-semibold">
              Места{' '}
              <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                {filteredPlaces.length} из {places.length}
              </span>
            </h2>
            <IconButton
              label="Сбросить фильтры"
              disabled={!hasFilters}
              onClick={() => setFilters(DEFAULT_PLACE_FILTERS)}
            >
              <RotateCcw size={16} aria-hidden="true" />
            </IconButton>
          </div>
          <div className="min-h-0 flex-1 overscroll-contain map:overflow-y-auto">
            {hasLoadError ? (
              <div
                className="grid justify-items-center gap-3.5 px-5 py-9 text-center text-[13px] text-muted-foreground"
                role="alert"
              >
                <AlertCircle size={26} aria-hidden="true" />
                <p>Не удалось загрузить места.</p>
                <button
                  type="button"
                  className="border-0 bg-transparent py-1.25 text-[13px] text-primary underline underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-40"
                  disabled={isRefreshing}
                  onClick={() => startTransition(() => router.refresh())}
                >
                  {isRefreshing ? 'Загружаем...' : 'Повторить'}
                </button>
              </div>
            ) : filteredPlaces.length ? (
              <ul aria-label="Список мест">
                {placesOnMap.map((place) => (
                  <li key={place.id}>
                    <PlaceCard place={place} onClick={openPlaceFromList} />
                  </li>
                ))}
              </ul>
            ) : (
              <div
                className="grid justify-items-center gap-3.5 px-5 py-9 text-center text-[13px] text-muted-foreground"
                role="status"
              >
                <MapPinOff size={26} aria-hidden="true" />
                <p>
                  {hasFilters
                    ? 'Ничего не найдено'
                    : 'Опубликованных мест пока нет'}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    className="border-0 bg-transparent py-1.25 text-[13px] text-primary underline underline-offset-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => setFilters(DEFAULT_PLACE_FILTERS)}
                  >
                    Сбросить фильтры
                  </button>
                )}
              </div>
            )}
          </div>
        </aside>
      ) : (
        <button
          type="button"
          className="absolute top-4 left-4 z-2 flex min-h-10 items-center gap-2 rounded-md border border-border bg-background px-3.5 py-2 text-[13px] text-primary shadow-panel hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Показать список мест"
          title="Показать список мест"
          aria-expanded={false}
          aria-controls="places-sidebar"
          onClick={() => setIsSidebarOpen(true)}
        >
          <ListFilter size={19} aria-hidden="true" />
          <span>Места ({filteredPlaces.length})</span>
        </button>
      )}
      {selectedPlace && (
        <PlaceDetailsDialog
          place={selectedPlace}
          onClose={() => setSelectedPlaceId(null)}
        />
      )}
    </main>
  );
}
