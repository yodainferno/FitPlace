import { MapPin } from 'lucide-react';
import cls from './PlacesExplorer.module.css';

export function PlacesExplorerLoading() {
  return (
    <main className={cls.explorer} lang="ru" aria-busy="true">
      <div className={cls.loadingPanel}>
        <div className={cls.header}>
          <MapPin size={25} className={cls.brandIcon} aria-hidden="true" />
          <h1 className={cls.brand}>Fitplace</h1>
        </div>
        <p role="status">Загружаем места...</p>
      </div>
    </main>
  );
}
