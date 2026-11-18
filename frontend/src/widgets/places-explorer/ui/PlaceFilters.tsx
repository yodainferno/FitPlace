import { Search } from 'lucide-react';
import { getPlaceCategoryLabel } from '@/src/entities/place';
import type { PlaceFilters as PlaceFiltersValue } from '../model/place-filters';
import cls from './PlacesExplorer.module.css';

type PlaceFiltersProps = {
  categories: string[];
  value: PlaceFiltersValue;
  onChange: (value: PlaceFiltersValue) => void;
};

export function PlaceFilters({
  categories,
  value,
  onChange,
}: PlaceFiltersProps) {
  return (
    <div className={cls.filters}>
      <label className={cls.searchField}>
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Поиск мест</span>
        <input
          type="search"
          placeholder="Название или адрес"
          value={value.query}
          onChange={(event) =>
            onChange({ ...value, query: event.target.value })
          }
        />
      </label>
      <div className={cls.filterRow}>
        <label className={cls.filterLabel}>
          Категория
          <select
            value={value.category}
            onChange={(event) =>
              onChange({ ...value, category: event.target.value })
            }
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {getPlaceCategoryLabel(category)}
              </option>
            ))}
          </select>
        </label>
        <label className={cls.filterLabel}>
          Звёзды
          <select
            value={value.rating}
            onChange={(event) =>
              onChange({ ...value, rating: event.target.value })
            }
          >
            <option value="">Любая оценка</option>
            <option value="unrated">Без звёзд</option>
            <option value="1">От 1 звезды</option>
            <option value="2">От 2 звёзд</option>
            <option value="3">3 звезды</option>
          </select>
        </label>
      </div>
    </div>
  );
}
