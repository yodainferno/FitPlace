import 'server-only';

import {
  type LoadState,
  ErrorState,
  createSuccessState,
} from '@/src/shared/model';
import {
  checkPublishedPlacesSchema,
  type PublishedPlace,
} from '@/src/entities/place';

export async function getAllPlaces(): Promise<LoadState<PublishedPlace[]>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MOCK_API_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_MOCK_API_URL is not configured');
    }

    const response = await fetch(
      `${baseUrl}/places?publishState.status=PUBLISHED`,
      { cache: 'no-store', signal: AbortSignal.timeout(10_000) },
    );

    if (!response.ok) {
      throw new Error(`Places API returned ${response.status}`);
    }

    const data: unknown = await response.json();
    return createSuccessState(checkPublishedPlacesSchema(data));
  } catch (error) {
    console.error('Failed to load published places:', error);
    return ErrorState;
  }
}
