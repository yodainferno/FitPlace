import type { PublishedPlace } from '@/src/entities/place';

export type MapFocusRequest = {
  location: Pick<PublishedPlace['location'], 'latitude' | 'longitude'>;
  isSidebarOpen: boolean;
};
