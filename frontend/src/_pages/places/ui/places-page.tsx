import { Suspense } from 'react';
import {
  PlacesExplorer,
  PlacesExplorerLoading,
} from '@/src/widgets/places-explorer';

export default function PlacesPage() {
  return (
    <Suspense fallback={<PlacesExplorerLoading />}>
      <PlacesExplorer />
    </Suspense>
  );
}
