import { z } from 'zod';

export const MAX_MAP_ZOOM = 22;
export const MAX_MAP_PITCH = 85;
const MAX_MAP_LATITUDE = 85.051129;

const numberParamSchema = z
  .string()
  .trim()
  .regex(/^-?\d+(?:\.\d+)?$/)
  .transform(Number)
  .pipe(z.number().finite());

const mapViewStateSchema = z.object({
  longitude: numberParamSchema.pipe(z.number().min(-180).max(180)),
  latitude: numberParamSchema.pipe(
    z.number().min(-MAX_MAP_LATITUDE).max(MAX_MAP_LATITUDE),
  ),
  zoom: numberParamSchema.pipe(z.number().min(0).max(MAX_MAP_ZOOM)),
  bearing: numberParamSchema.pipe(z.number().min(-180).max(180)),
  pitch: numberParamSchema.pipe(z.number().min(0).max(MAX_MAP_PITCH)),
});

export type MapViewState = z.output<typeof mapViewStateSchema>;

export const DEFAULT_MAP_VIEW: MapViewState = {
  longitude: 37.6,
  latitude: 55.75,
  zoom: 10,
  bearing: 0,
  pitch: 0,
};

export function readMapViewState(
  params: Pick<URLSearchParams, 'get'>,
): MapViewState | null {
  const result = mapViewStateSchema.safeParse({
    longitude: params.get('lng'),
    latitude: params.get('lat'),
    zoom: params.get('zoom'),
    bearing: params.get('bearing') ?? '0',
    pitch: params.get('pitch') ?? '0',
  });

  return result.success ? result.data : null;
}

function wrapAngle(value: number): number {
  return ((((value + 180) % 360) + 360) % 360) - 180;
}

function round(value: number, digits: number): string {
  return String(Number(value.toFixed(digits)));
}

export function getMapViewParams(
  view: MapViewState,
): Record<string, string | null> {
  const bearing = round(wrapAngle(view.bearing), 2);
  const pitch = round(view.pitch, 2);

  return {
    lng: round(wrapAngle(view.longitude), 6),
    lat: round(view.latitude, 6),
    zoom: round(view.zoom, 3),
    bearing: bearing === '0' ? null : bearing,
    pitch: pitch === '0' ? null : pitch,
  };
}

export function areMapViewsEqual(a: MapViewState, b: MapViewState): boolean {
  const aParams = getMapViewParams(a);
  const bParams = getMapViewParams(b);
  return Object.keys(aParams).every((key) => aParams[key] === bParams[key]);
}
