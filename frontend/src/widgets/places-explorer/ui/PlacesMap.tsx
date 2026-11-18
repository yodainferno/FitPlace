'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Map, {
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from 'react-map-gl/maplibre';
import { LngLatBounds, type Popup as MapLibrePopup } from 'maplibre-gl';
import { MapPin, RotateCcw } from 'lucide-react';
import { PlacePopover, type PlaceOnMap } from '@/src/entities/place';
import { classNames } from '@/src/shared/lib';
import 'maplibre-gl/dist/maplibre-gl.css';
import cls from './PlacesExplorer.module.css';

const MARKER_ICON_SIZE = 34;
// MapPin's tip is (12, 22), not the center (12, 12) of its 24x24 viewBox.
const MARKER_OFFSET: [number, number] = [
  0,
  -((22 - 12) / 24) * MARKER_ICON_SIZE,
];

const POPUP_GAP = 6;
const POPUP_OFFSET = {
  center: [0, MARKER_OFFSET[1]],
  top: [0, POPUP_GAP],
  'top-left': [0, POPUP_GAP],
  'top-right': [0, POPUP_GAP],
  bottom: [0, -MARKER_ICON_SIZE],
  'bottom-left': [0, -MARKER_ICON_SIZE],
  'bottom-right': [0, -MARKER_ICON_SIZE],
  left: [MARKER_ICON_SIZE / 3 + POPUP_GAP, MARKER_OFFSET[1]],
  right: [-(MARKER_ICON_SIZE / 3 + POPUP_GAP), MARKER_OFFSET[1]],
} satisfies Record<string, [number, number]>;

type PlacesMapProps = {
  places: PlaceOnMap[];
  isSidebarOpen: boolean;
  onClickPlace: (place: PlaceOnMap) => void;
};

function getPadding(map: MapRef, isSidebarOpen: boolean) {
  const { clientWidth, clientHeight } = map.getContainer();
  return clientWidth <= 720
    ? {
        top: 64,
        right: 32,
        left: 32,
        bottom: isSidebarOpen ? Math.round(clientHeight * 0.52) + 24 : 64,
      }
    : { top: 72, right: 72, bottom: 72, left: isSidebarOpen ? 416 : 72 };
}

export default function PlacesMap({
  places,
  onClickPlace,
  isSidebarOpen,
}: PlacesMapProps) {
  const mapRef = useRef<MapRef>(null);
  const popupRef = useRef<MapLibrePopup>(null);
  const popoverId = useId();
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const hoveredPlace = places.find((place) => place.id === hoveredPlaceId);

  useEffect(() => {
    const popup = popupRef.current;
    const element = popup?.getElement();
    if (!popup || !element) return;

    // Recalculate the anchor once React content has its actual dimensions.
    const observer = new ResizeObserver(() => {
      popup.setOffset(POPUP_OFFSET);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hoveredPlace]);

  function showAllPlaces() {
    const map = mapRef.current;
    if (!map || !places.length) return;

    const bounds = new LngLatBounds();
    places.forEach((place) =>
      bounds.extend([place.location.longitude, place.location.latitude]),
    );
    map.fitBounds(bounds, {
      padding: getPadding(map, isSidebarOpen),
      maxZoom: 14,
      duration: 500,
    });
  }

  function clearHover(placeId: string) {
    setHoveredPlaceId((current) => (current === placeId ? null : current));
  }

  return (
    <section
      className={classNames(cls.map, { [cls.withSidebar]: isSidebarOpen })}
      aria-label="Карта мест"
    >
      <Map
        key={attempt}
        ref={mapRef}
        initialViewState={{ longitude: 37.6, latitude: 55.75, zoom: 10 }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: '100%', height: '100%' }}
        locale={{
          'NavigationControl.ZoomIn': 'Приблизить',
          'NavigationControl.ZoomOut': 'Отдалить',
        }}
        onLoad={() => {
          setIsReady(true);
          showAllPlaces();
        }}
        onError={() => setHasMapError(true)}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {places.map((place) => (
          <Marker
            key={place.id}
            latitude={place.location.latitude}
            longitude={place.location.longitude}
            anchor="center"
            offset={MARKER_OFFSET}
            ref={(marker) => {
              // Interaction and accessibility belong to the inner button.
              const element = marker?.getElement();
              element?.setAttribute('role', 'presentation');
              element?.setAttribute('aria-label', '');
              element?.removeAttribute('tabindex');
            }}
          >
            <button
              type="button"
              data-place-id={place.id}
              aria-label={`Открыть место: ${place.name}`}
              aria-haspopup="dialog"
              aria-pressed={Boolean(place.highlight)}
              aria-describedby={
                hoveredPlace?.id === place.id ? popoverId : undefined
              }
              className={classNames(cls.marker, {
                [cls.markerSelected]: place.highlight,
              })}
              onMouseEnter={() => setHoveredPlaceId(place.id)}
              onMouseLeave={() => clearHover(place.id)}
              onFocus={() => setHoveredPlaceId(place.id)}
              onBlur={() => clearHover(place.id)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') setHoveredPlaceId(null);
              }}
              onClick={(event) => {
                event.currentTarget.focus();
                setHoveredPlaceId(null);
                onClickPlace(place);
              }}
            >
              <MapPin
                size={MARKER_ICON_SIZE}
                fill="currentColor"
                stroke="white"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
          </Marker>
        ))}
        {hoveredPlace && (
          <Popup
            ref={popupRef}
            padding={{ top: 8, right: 8, bottom: 8, left: 8 }}
            latitude={hoveredPlace.location.latitude}
            longitude={hoveredPlace.location.longitude}
            offset={POPUP_OFFSET}
            maxWidth="260px"
            closeButton={false}
            closeOnClick={false}
            focusAfterOpen={false}
            className={cls.placePopup}
          >
            <PlacePopover id={popoverId} place={hoveredPlace} />
          </Popup>
        )}
      </Map>
      {!isReady && !hasMapError && (
        <p className={cls.mapNotice} role="status">
          Загружаем карту...
        </p>
      )}
      {hasMapError && (
        <div className={cls.mapNotice} role="alert">
          <span>Не удалось полностью загрузить карту.</span>
          <button
            type="button"
            className={cls.iconButton}
            aria-label="Повторить загрузку карты"
            title="Повторить"
            onClick={() => {
              setIsReady(false);
              setHasMapError(false);
              setAttempt((value) => value + 1);
            }}
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
