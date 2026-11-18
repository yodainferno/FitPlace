export enum PlaceRecommendation {
  Ordinary = 0,
  WorthVisit = 1,
  WorthDetour = 2,
  WorthTrip = 3,
}

export const PLACE_RECOMMENDATION_LEVELS = [
  PlaceRecommendation.Ordinary,
  PlaceRecommendation.WorthVisit,
  PlaceRecommendation.WorthDetour,
  PlaceRecommendation.WorthTrip,
] as const;

const RECOMMENDATION_LABELS = {
  [PlaceRecommendation.Ordinary]: 'Обычное место',
  [PlaceRecommendation.WorthVisit]: 'Заглянуть по пути',
  [PlaceRecommendation.WorthDetour]: 'Сделать крюк',
  [PlaceRecommendation.WorthTrip]: 'Цель поездки',
} satisfies Record<PlaceRecommendation, string>;

const RECOMMENDATION_DESCRIPTIONS = {
  [PlaceRecommendation.Ordinary]: 'Обычное место для занятий.',
  [PlaceRecommendation.WorthVisit]: 'Можно заглянуть, если будешь рядом.',
  [PlaceRecommendation.WorthDetour]:
    'Стоит отклониться от маршрута ради этого места.',
  [PlaceRecommendation.WorthTrip]: 'Сюда стоит ехать специально.',
} satisfies Record<PlaceRecommendation, string>;

export function getPlaceRecommendationLabel(
  value: PlaceRecommendation,
): string {
  return RECOMMENDATION_LABELS[value];
}

export function getPlaceRecommendationDescription(
  value: PlaceRecommendation,
): string {
  return RECOMMENDATION_DESCRIPTIONS[value];
}
