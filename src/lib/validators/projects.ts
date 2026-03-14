import { z } from 'zod';

export const projectStatusSchema = z.enum(['draft', 'active', 'completed', 'archived']);

export const projectInputSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  status: projectStatusSchema,
  designerId: z.string().trim().min(1).nullable().optional(),
  purchaserId: z.string().trim().min(1).nullable().optional(),
});

export const projectModuleInputSchema = z.object({
  name: z.string().trim().min(1),
});
