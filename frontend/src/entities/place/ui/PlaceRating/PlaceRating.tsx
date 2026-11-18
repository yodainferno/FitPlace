import { RateDisplay } from '@/src/shared/ui/Rate';
import { getPlaceRatingLabel } from '../../model/place-labels';
import type { Place } from '../../model/types/place';

type PlaceRatingProps = {
  value: Place['rate'];
  showLabel?: boolean;
};

export function PlaceRating({ value, showLabel = true }: PlaceRatingProps) {
  const label = getPlaceRatingLabel(value);

  if (!value) {
    return <span className="text-xs text-neutral-500">{label}</span>;
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-600">
      <RateDisplay
        value={value}
        maxValue={3}
        srLabel={() => `${value} из 3. ${label}`}
      />
      {showLabel && <span aria-hidden="true">{label}</span>}
    </span>
  );
}
