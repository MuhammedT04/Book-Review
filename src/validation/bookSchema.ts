import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required" }),
  author: z.string().trim().min(1, { message: "Author is required" }),
  genre: z.string().min(1, { message: "Genre is required" }),
  description: z.string().optional(),
  averageRating: z.number().default(0).optional()
});
