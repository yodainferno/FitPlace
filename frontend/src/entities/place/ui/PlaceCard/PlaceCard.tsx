import { ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/src/shared/lib';
import { getPlaceCategoryLabel } from '../../model/place-labels';
import type { PlaceOnMap } from '../../model/types/place';
import { PlaceRating } from '../PlaceRating/PlaceRating';

type PlaceCardProps = {
  place: PlaceOnMap;
  onClick?: (place: PlaceOnMap) => void;
};

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full flex-col gap-2 border-0 border-b border-l-[3px] border-b-border bg-background p-4 text-left text-foreground',
        'focus-visible:relative focus-visible:outline-2 focus-visible:-outline-offset-3 focus-visible:outline-primary',
        place.highlight
          ? 'border-l-secondary bg-secondary/8 hover:bg-secondary/12'
          : 'border-l-transparent hover:bg-primary/5',
      )}
      aria-haspopup="dialog"
      aria-pressed={Boolean(place.highlight)}
      onClick={(event) => {
        event.currentTarget.focus();
        onClick?.(place);
      }}
    >
      <span className="text-[11px] font-semibold text-primary">
        {getPlaceCategoryLabel(place.category)}
      </span>
      <span className="flex items-start justify-between gap-3">
        <span className="text-[15px] leading-[1.4] font-semibold wrap-anywhere">
          {place.name}
        </span>
        <ChevronRight
          size={16}
          className="mt-0.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </span>
      <span className="flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground wrap-anywhere">
        <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{place.location.address}</span>
      </span>
      <PlaceRating value={place.rate} />
    </button>
  );
}
