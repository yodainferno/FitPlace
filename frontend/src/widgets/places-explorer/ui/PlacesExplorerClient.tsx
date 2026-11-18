'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import {
  AlertCircle,
  ListFilter,
  MapPin,
  MapPinOff,
  PanelLeftClose,
  RotateCcw,
} from 'lucide-react';
import {
  getPlaceCategoryLabel,
  PlaceCard,
  type PlaceOnMap,
  type PublishedPlace,
} from '@/src/entities/place';
import { DEFAULT_PLACE_FILTERS, filterPlaces } from '../model/place-filters';
import { PlaceFilters } from './PlaceFilters';
import { PlaceDetailsDialog } from './PlaceDetailsDialog';
import cls from './PlacesExplorer.module.css';

const PlacesMap = dynamic(() => import('./PlacesMap'), {
  ssr: false,
  loading: () => (
    <div className={cls.mapLoading} role="status">
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
    filters.query || filters.category || filters.rating,
  );
  const openPlace = (place: PlaceOnMap) => setSelectedPlaceId(place.id);

  return (
    <main className={cls.explorer} lang="ru">
      <PlacesMap
        places={placesOnMap}
        onClickPlace={openPlace}
        isSidebarOpen={isSidebarOpen}
      />
      {isSidebarOpen ? (
        <aside
          id="places-sidebar"
          className={cls.sidebar}
          aria-label="Места и фильтры"
        >
          <header className={cls.header}>
            <MapPin size={25} className={cls.brandIcon} aria-hidden="true" />
            <h1 className={cls.brand}>Fitplace</h1>
            <button
              type="button"
              className={cls.iconButton}
              aria-label="Скрыть список мест"
              title="Скрыть список мест"
              aria-expanded={true}
              aria-controls="places-sidebar"
              onClick={() => setIsSidebarOpen(false)}
            >
              <PanelLeftClose size={19} aria-hidden="true" />
            </button>
          </header>
          <PlaceFilters
            categories={categories}
            value={filters}
            onChange={setFilters}
          />
          <div className={cls.resultsHeading}>
            <h2>
              Места{' '}
              <span>
                {filteredPlaces.length} из {places.length}
              </span>
            </h2>
            <button
              type="button"
              className={cls.iconButton}
              aria-label="Сбросить фильтры"
              title="Сбросить фильтры"
              disabled={!hasFilters}
              onClick={() => setFilters(DEFAULT_PLACE_FILTERS)}
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          </div>
          <div className={cls.results}>
            {hasLoadError ? (
              <div className={cls.empty} role="alert">
                <AlertCircle size={26} aria-hidden="true" />
                <p>Не удалось загрузить места.</p>
                <button
                  type="button"
                  className={cls.textButton}
                  disabled={isRefreshing}
                  onClick={() => startTransition(() => router.refresh())}
                >
                  {isRefreshing ? 'Загружаем...' : 'Повторить'}
                </button>
              </div>
            ) : filteredPlaces.length ? (
              <ul className={cls.list} aria-label="Список мест">
                {placesOnMap.map((place) => (
                  <li key={place.id}>
                    <PlaceCard place={place} onClick={openPlace} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={cls.empty} role="status">
                <MapPinOff size={26} aria-hidden="true" />
                <p>
                  {hasFilters
                    ? 'Ничего не найдено'
                    : 'Опубликованных мест пока нет'}
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    className={cls.textButton}
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
          className={cls.showSidebar}
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
