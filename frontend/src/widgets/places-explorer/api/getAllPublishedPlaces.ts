import axios from 'axios';
import {type LoadState, ErrorState, createSuccessState} from "@/src/shared/model/load-state";
import {Place} from "@/src/entities/place";
import {checkPublishedPlacesSchema} from "@/src/entities/place/model/types/placeSchema";


export async function getAllPlaces(): Promise<LoadState<Place[]>>  {
    const baseUrl = process.env.NEXT_PUBLIC_MOCK_API_URL;
    const url = `${baseUrl}/places?publishState.status=PUBLISHED`

    try {
        const response = await axios.get(url);
        const places = checkPublishedPlacesSchema(response.data);
        return createSuccessState<Place[]>(places)
    } catch (error) {
        console.error(error);
        return ErrorState;
    }

}
