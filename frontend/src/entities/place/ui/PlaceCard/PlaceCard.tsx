import React from 'react';
import { PlaceOnMap } from '../../model/types/place';
import cls from './PlaceCard.module.css';
import { classNames } from '@/src/shared/lib';

type PlaceCardProps = {
  place: PlaceOnMap;
  onClick?: (place: PlaceOnMap) => void;
};
export function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <button
      className={classNames(cls.placeCard, { [cls.selected]: place.highlight })}
      onClick={() => onClick && onClick(place)}
    >
      <span>{place.id}</span>
      <span>{place.name}</span>
    </button>
  );
}
