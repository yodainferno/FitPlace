import { MapPin } from 'lucide-react';
import { PlaceRecommendation } from '../../model/place-recommendation';
import { RECOMMENDATION_APPEARANCE } from '../recommendation-appearance';

export const PLACE_MAP_PIN_SIZE = 34;

type PlaceMapPinProps = {
  value: PlaceRecommendation;
};

export function PlaceMapPin({ value }: PlaceMapPinProps) {
  const Icon = RECOMMENDATION_APPEARANCE[value].icon;
  const hasRecommendation = value !== PlaceRecommendation.Ordinary;

  return (
    <span className="relative block size-[34px]" aria-hidden="true">
      <MapPin
        size={PLACE_MAP_PIN_SIZE}
        fill="currentColor"
        stroke="white"
        strokeWidth={1.5}
        className={hasRecommendation ? '[&>circle]:hidden' : undefined}
      />
      {hasRecommendation && (
        <Icon
          size={12}
          strokeWidth={2.5}
          className="absolute top-2 left-1/2 -translate-x-1/2 text-white"
        />
      )}
    </span>
  );
}
