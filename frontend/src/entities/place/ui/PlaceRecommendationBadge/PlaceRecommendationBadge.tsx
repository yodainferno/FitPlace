import { cn } from '@/src/shared/lib';
import {
  getPlaceRecommendationLabel,
  getPlaceRecommendationDescription,
  PlaceRecommendation,
} from '../../model/place-recommendation';
import { RECOMMENDATION_APPEARANCE } from '../recommendation-appearance';

type PlaceRecommendationBadgeProps = {
  value?: PlaceRecommendation;
  showDescription?: boolean;
};

export function PlaceRecommendationBadge({
  value = PlaceRecommendation.Ordinary,
  showDescription = false,
}: PlaceRecommendationBadgeProps) {
  if (value === PlaceRecommendation.Ordinary) return null;

  const { badge, icon: Icon } = RECOMMENDATION_APPEARANCE[value];

  const badgeElement = (
    <span
      className={cn(
        'inline-flex max-w-full w-fit items-center gap-1.5 rounded border px-2 py-1 text-[11px] leading-4 font-semibold',
        badge,
      )}
    >
      <Icon size={14} className="shrink-0" aria-hidden="true" />
      <span className="wrap-anywhere">
        {getPlaceRecommendationLabel(value)}
      </span>
    </span>
  );

  if (!showDescription) return badgeElement;

  return (
    <span className="grid max-w-full justify-items-start gap-1.5">
      {badgeElement}
      <span className="text-xs leading-relaxed text-muted-foreground wrap-anywhere">
        {getPlaceRecommendationDescription(value)}
      </span>
    </span>
  );
}
