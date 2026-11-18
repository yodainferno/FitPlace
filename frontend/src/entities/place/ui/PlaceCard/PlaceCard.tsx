import { ChevronRight, MapPin } from 'lucide-react';
import { classNames } from '@/src/shared/lib';
import { getPlaceCategoryLabel } from '../../model/place-labels';
import type { PlaceOnMap } from '../../model/types/place';
import { PlaceRating } from '../PlaceRating/PlaceRating';
import cls from './PlaceCard.module.css';

type PlaceCardProps = {
  place: PlaceOnMap;
  onClick?: (place: PlaceOnMap) => void;
};

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <button
      type="button"
      className={classNames(cls.placeCard, { [cls.selected]: place.highlight })}
      aria-haspopup="dialog"
      aria-pressed={Boolean(place.highlight)}
      onClick={(event) => {
        event.currentTarget.focus();
        onClick?.(place);
      }}
    >
      <span className={cls.category}>
        {getPlaceCategoryLabel(place.category)}
      </span>
      <span className={cls.heading}>
        <span className={cls.name}>{place.name}</span>
        <ChevronRight size={16} aria-hidden="true" />
      </span>
      <span className={cls.address}>
        <MapPin size={14} aria-hidden="true" />
        <span>{place.location.address}</span>
      </span>
      <PlaceRating value={place.rate} />
    </button>
  );
}
