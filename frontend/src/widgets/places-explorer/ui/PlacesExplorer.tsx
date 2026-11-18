import { getAllPlaces } from '../api/getAllPublishedPlaces';
import { PlacesExplorerClient } from './PlacesExplorerClient';

export default async function PlacesExplorer() {
  const result = await getAllPlaces();

  return (
    <PlacesExplorerClient
      places={result.state === 'success' ? result.data : []}
      hasLoadError={result.state !== 'success'}
    />
  );
}
