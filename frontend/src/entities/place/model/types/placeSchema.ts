import { z } from 'zod';
import { PlaceRecommendation } from '../place-recommendation';

const publishedPlaceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  user_id: z.string().optional(),
  category: z.string().optional(),
  publishState: z.object({
    status: z.literal('PUBLISHED'),
  }),
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    address: z.string().min(1),
  }),
  about: z
    .object({
      description: z.string(),
      workingHours: z.string(),
    })
    .optional(),
  recommendation: z
    .enum(PlaceRecommendation)
    .default(PlaceRecommendation.Ordinary),
});

const publishedPlacesSchema = z.array(publishedPlaceSchema);
export type PublishedPlace = z.infer<typeof publishedPlaceSchema>;

export function checkPublishedPlacesSchema(data: unknown): PublishedPlace[] {
  return publishedPlacesSchema.parse(data);
}
