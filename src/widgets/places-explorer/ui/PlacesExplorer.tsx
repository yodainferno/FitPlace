'use client'

import React, {useEffect, useState} from 'react';
import {getAllPlaces} from "../api/getAllPublishedPlaces";
import {type Place, PlaceCard} from "@/src/entities/place";
import {LoadingState, type LoadState} from "@/src/shared/model/load-state";

const PlacesExplorer = () => {
    const [places, setPlaces] = useState<LoadState<Place[]>>(LoadingState);

    useEffect(() => {
        getAllPlaces().then((resp) => {
            setPlaces(resp)
        })
    }, [])

    if (places.state === 'loading') {
        return <div>Loading...</div>
    }
    if (places.state === 'error') {
        return <div>Error!</div>
    }
    if (places.state === 'success' && !places.data.length) {
        return <div>No data!</div>
    }
    return (
        <div>
            {places.data.map((place) => <PlaceCard key={place.id} place={place} />)}
        </div>
    );
};

export default PlacesExplorer;
