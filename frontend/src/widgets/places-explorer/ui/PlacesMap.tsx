'use client';

import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place, PlaceOnMap } from '@/src/entities/place';
import { MapPin } from 'lucide-react';

type PlacesMapProps = {
  places: PlaceOnMap[];
  onClickPlace?: (place: Place) => void;
};
export default function PlacesMap({ places, onClickPlace }: PlacesMapProps) {
  return (
    <Map
      initialViewState={{ longitude: 37.6, latitude: 55.75, zoom: 10 }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      style={{ width: '100%', height: 400 }}
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          latitude={place.location!.latitude}
          longitude={place.location!.longitude}
        >
          <button
            type="button"
            aria-label={`Выбрать ${place.name}`}
            aria-pressed={Boolean(place.highlight)}
            onClick={() => onClickPlace && onClickPlace(place)}
            className="grid size-11 items-end justify-items-center"
            style={{ color: place.highlight ? '#dc2626' : '#0284c7' }}
          >
            <MapPin size={place.highlight ? 36 : 28} aria-hidden="true" />
          </button>
        </Marker>
      ))}
    </Map>
  );
}
