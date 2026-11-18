import { getPlaceCategoryLabel } from '../../model/place-labels';
import type { PublishedPlace } from '../../model/types/placeSchema';
import { PlaceRating } from '../PlaceRating/PlaceRating';

type PlacePopoverProps = {
  id: string;
  place: PublishedPlace;
};

export function PlacePopover({ id, place }: PlacePopoverProps) {
  return (
    <div
      id={id}
      role="tooltip"
      className="grid w-[220px] gap-2 text-neutral-900"
    >
      <span className="text-xs text-green-800">
        {getPlaceCategoryLabel(place.category)}
      </span>
      <strong className="text-sm leading-snug break-words">{place.name}</strong>
      <PlaceRating value={place.rate} showLabel={false} />
    </div>
  );
}
