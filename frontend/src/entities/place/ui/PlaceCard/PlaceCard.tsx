import React from 'react';
import {Place} from "../../model/types/place";
import cls from './PlaceCard.module.css'

type PlaceCardProps = {
    place: Place
}
export function PlaceCard({place}: PlaceCardProps) {
    return (
        <div className={cls.placeCard}>
            <span>{place.id}</span>
            <span>{place.name}</span>
        </div>
    );
}
