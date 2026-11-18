import { getPlaceCategoryLabel } from '../../model/place-labels';
import type { PublishedPlace } from '../../model/types/placeSchema';
import { PlaceRecommendationBadge } from '../PlaceRecommendationBadge/PlaceRecommendationBadge';

type PlacePopoverProps = {
  id: string;
  place: PublishedPlace;
};

export function PlacePopover({ id, place }: PlacePopoverProps) {
  return (
    <div id={id} role="tooltip" className="grid w-55 gap-2 text-foreground">
      <span className="text-xs text-primary">
        {getPlaceCategoryLabel(place.category)}
      </span>
      <strong className="text-sm leading-snug wrap-anywhere">
        {place.name}
      </strong>
      <PlaceRecommendationBadge value={place.recommendation} showDescription />
    </div>
  );
}
