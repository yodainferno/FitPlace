import { Suspense } from 'react';
import { PlacesExplorer } from '@/src/widgets/places-explorer';

export default function PlacesPage() {
  return (
    <main className="min-h-screen bg-white p-4 text-neutral-900">
      <h1 className="mb-4 text-2xl font-semibold">Fitplace</h1>
      <Suspense fallback={<p role="status">Загружаем места...</p>}>
        <PlacesExplorer />
      </Suspense>
    </main>
  );
}
