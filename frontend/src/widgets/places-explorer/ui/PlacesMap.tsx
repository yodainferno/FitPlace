'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Map, {
  Marker,
  NavigationControl,
  Popup,
  type MapRef,
} from 'react-map-gl/maplibre';
import { LngLatBounds, type Popup as MapLibrePopup } from 'maplibre-gl';
import { RotateCcw } from 'lucide-react';
import {
  getPlaceRecommendationLabel,
  getPlaceRecommendationMarkerClassName,
  PlacePopover,
  PlaceMapPin,
  PLACE_MAP_PIN_SIZE,
  type PlaceOnMap,
} from '@/src/entities/place';
import { cn } from '@/src/shared/lib';
import { IconButton } from '@/src/shared/ui/IconButton';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapFocusRequest } from '../model/map-focus-request';
import cls from './PlacesMap.module.css';

const MARKER_ICON_SIZE = PLACE_MAP_PIN_SIZE;
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
  focusRequest: MapFocusRequest | null;
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
  focusRequest,
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
    const map = mapRef.current;
    if (!map || !isReady || !focusRequest) return;

    map.easeTo({
      center: [focusRequest.location.longitude, focusRequest.location.latitude],
      padding: getPadding(map, focusRequest.isSidebarOpen),
      duration: 650,
    });
  }, [focusRequest, isReady]);

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

  const noticeClassName = cn(
    'absolute right-4 bottom-10 z-1 flex max-w-[min(22.5rem,calc(100%-2rem))] items-center gap-2 rounded border border-border bg-background px-3.5 py-2.5 text-xs text-muted-foreground',
    isSidebarOpen && 'max-map:bottom-[calc(52dvh+54px)]',
  );

  return (
    <section
      className={cn(
        'absolute inset-0',
        cls.controls,
        isSidebarOpen && cls.withSidebar,
      )}
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
              aria-label={`Открыть место: ${place.name}. ${getPlaceRecommendationLabel(place.recommendation)}`}
              aria-haspopup="dialog"
              aria-pressed={Boolean(place.highlight)}
              aria-describedby={
                hoveredPlace?.id === place.id ? popoverId : undefined
              }
              className={cn(
                'flex size-11 items-center justify-center rounded border-0 bg-transparent p-0 drop-shadow-[0_2px_2px_rgb(36_40_43_/_25%)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                getPlaceRecommendationMarkerClassName(place.recommendation),
                'hover:brightness-90',
                place.highlight &&
                  'outline-2 outline-offset-2 outline-foreground/70',
              )}
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
              <PlaceMapPin value={place.recommendation} />
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
            className={cn('pointer-events-none', cls.popup)}
          >
            <PlacePopover id={popoverId} place={hoveredPlace} />
          </Popup>
        )}
      </Map>
      {!isReady && !hasMapError && (
        <p className={noticeClassName} role="status">
          Загружаем карту...
        </p>
      )}
      {hasMapError && (
        <div className={noticeClassName} role="alert">
          <span>Не удалось полностью загрузить карту.</span>
          <IconButton
            label="Повторить загрузку карты"
            onClick={() => {
              setIsReady(false);
              setHasMapError(false);
              setAttempt((value) => value + 1);
            }}
          >
            <RotateCcw size={16} aria-hidden="true" />
          </IconButton>
        </div>
      )}
    </section>
  );
}
