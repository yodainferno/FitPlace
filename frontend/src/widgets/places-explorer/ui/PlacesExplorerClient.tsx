'use client';

import dynamic from 'next/dynamic';
import {
  PlaceCard,
  PlaceOnMap,
  type PublishedPlace,
} from '@/src/entities/place';
import { useMemo, useState } from 'react';

const PlacesMap = dynamic(() => import('./PlacesMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-neutral-100 p-4" role="status">
      Загружаем карту...
    </div>
  ),
});

type PlacesExplorerClientProps = {
  places: PublishedPlace[];
};

export function PlacesExplorerClient({ places }: PlacesExplorerClientProps) {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const togglePlaceOnMap = (place: PlaceOnMap) =>
    selectedPlace === place.id
      ? setSelectedPlace(null)
      : setSelectedPlace(place.id);

  const placesOnMap = useMemo<PlaceOnMap[]>(
    () =>
      places.map((place) => {
        if (place.id === selectedPlace) {
          return {
            ...place,
            highlight: true,
          };
        }
        return place;
      }),
    [selectedPlace, places],
  );

  return (
    <div className="grid gap-4 md:grid-cols-[20rem_minmax(0,1fr)]">
      <section aria-labelledby="places-heading">
        <h2 id="places-heading" className="mb-3 text-lg font-semibold">
          Места ({places.length})
        </h2>
        <div className="grid gap-2">
          {placesOnMap.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={togglePlaceOnMap}
            />
          ))}
        </div>
      </section>
      <section aria-label="Карта мест" className="min-w-0">
        <PlacesMap places={placesOnMap} onClickPlace={togglePlaceOnMap} />
      </section>
    </div>
  );
}
