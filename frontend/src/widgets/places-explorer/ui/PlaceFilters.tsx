import { Search } from 'lucide-react';
import { getPlaceCategoryLabel } from '@/src/entities/place';
import type { PlaceFilters as PlaceFiltersValue } from '../model/place-filters';

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
    <div className="grid shrink-0 gap-3 border-b border-border px-3.5 py-3 map:p-4">
      <label className="flex min-w-0 items-center gap-2 rounded-[5px] border border-border bg-surface px-2.5 py-2.5 text-muted-foreground focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-primary">
        <Search size={17} className="shrink-0" aria-hidden="true" />
        <span className="sr-only">Поиск мест</span>
        <input
          type="search"
          className="w-full min-w-0 border-0 bg-transparent text-[13px] text-foreground outline-none"
          placeholder="Название или адрес"
          value={value.query}
          onChange={(event) =>
            onChange({ ...value, query: event.target.value })
          }
        />
      </label>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-2.5">
        <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-muted-foreground">
          Категория
          <select
            className="w-full min-w-0 rounded border border-border bg-background p-2 text-xs font-normal text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
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
        <label className="grid min-w-0 gap-1.5 text-[11px] font-semibold text-muted-foreground">
          Звёзды
          <select
            className="w-full min-w-0 rounded border border-border bg-background p-2 text-xs font-normal text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
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
