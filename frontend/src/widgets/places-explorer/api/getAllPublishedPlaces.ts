import axios from 'axios';
import {type LoadState, ErrorState, createSuccessState} from "@/src/shared/model";
import {checkPublishedPlacesSchema, type Place} from "@/src/entities/place";


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
