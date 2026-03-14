import { z } from 'zod';

export const purchasingStatusSchema = z.enum(['pending', 'quoted', 'ordered', 'received']);

export const purchasingWorkflowInputSchema = z.object({
  status: purchasingStatusSchema,
  supplierSelected: z.string().trim().min(1),
  quotedPrice: z.number().nonnegative(),
  poNumber: z.string().trim().min(1),
  notes: z.string().trim().min(1),
});
