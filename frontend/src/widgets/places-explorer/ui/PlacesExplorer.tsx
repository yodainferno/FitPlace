import { getAllPlaces } from '../api/getAllPublishedPlaces';
import { PlacesExplorerClient } from './PlacesExplorerClient';

export default async function PlacesExplorer() {
  const result = await getAllPlaces();

  if (result.state !== 'success') {
    return (
      <p role="alert">
        Не удалось загрузить места.{' '}
        <a href="/places" className="underline">
          Повторить
        </a>
      </p>
    );
  }

  if (!result.data.length) {
    return <p>Опубликованных мест пока нет.</p>;
  }

  return <PlacesExplorerClient places={result.data} />;
}
