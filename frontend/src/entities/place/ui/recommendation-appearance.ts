import { Flag, MapPin, Route, type LucideIcon } from 'lucide-react';
import { PlaceRecommendation } from '../model/place-recommendation';

export const RECOMMENDATION_APPEARANCE = {
  [PlaceRecommendation.Ordinary]: {
    badge: '',
    marker: 'text-muted-foreground',
    icon: MapPin,
  },
  [PlaceRecommendation.WorthVisit]: {
    badge: 'border-primary/20 bg-primary/10 text-primary-hover',
    marker: 'text-primary',
    icon: MapPin,
  },
  [PlaceRecommendation.WorthDetour]: {
    badge:
      'border-recommendation-detour/30 bg-recommendation-detour/15 text-recommendation-detour-foreground',
    marker: 'text-recommendation-detour',
    icon: Route,
  },
  [PlaceRecommendation.WorthTrip]: {
    badge: 'border-secondary bg-secondary text-secondary-foreground',
    marker: 'text-secondary',
    icon: Flag,
  },
} satisfies Record<
  PlaceRecommendation,
  { badge: string; marker: string; icon: LucideIcon }
>;

export function getPlaceRecommendationMarkerClassName(
  value: PlaceRecommendation,
): string {
  return RECOMMENDATION_APPEARANCE[value].marker;
}
