import { Search } from 'lucide-react';
import {
  getPlaceCategoryLabel,
  getPlaceRecommendationLabel,
  PLACE_RECOMMENDATION_LEVELS,
} from '@/src/entities/place';
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
      <div className="grid gap-2.5">
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
        <fieldset className="min-w-0">
          <legend className="mb-1.5 text-[11px] font-semibold text-muted-foreground">
            Рекомендации
          </legend>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {PLACE_RECOMMENDATION_LEVELS.map((level) => (
              <label
                key={level}
                className="flex min-h-8 min-w-0 cursor-pointer items-start gap-2 py-1 text-xs leading-5 text-foreground"
              >
                <input
                  type="checkbox"
                  className="mt-1 size-3.5 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  checked={value.recommendations.includes(level)}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      recommendations: event.target.checked
                        ? [...value.recommendations, level]
                        : value.recommendations.filter(
                            (selected) => selected !== level,
                          ),
                    })
                  }
                />
                <span className="wrap-anywhere">
                  {getPlaceRecommendationLabel(level)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
