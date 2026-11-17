import { z } from 'zod';

const publishedPlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  publishState: z.object({
    status: z.literal('PUBLISHED'),
  }),
});

const publishedPlacesSchema = z.array(publishedPlaceSchema);
type PublishedPlace = z.infer<typeof publishedPlaceSchema>;

export function checkPublishedPlacesSchema(data: unknown): PublishedPlace[] {
  return publishedPlacesSchema.parse(data);
}
