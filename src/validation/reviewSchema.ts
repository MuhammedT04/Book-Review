import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must not exceed 5' }),
  comment: z.string().trim().optional(),
});
