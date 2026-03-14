import { z } from 'zod';

export const partCategorySchema = z.enum(['fabrication', 'standard_part', 'modifications']);

export const bomItemInputSchema = z.object({
  partNumber: z.string().trim().min(1),
  partDescription: z.string().trim().min(1),
  vendor: z.string().trim().min(1),
  partCategory: partCategorySchema,
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});
