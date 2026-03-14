import { z } from 'zod';

export const userRoleSchema = z.enum(['owner', 'admin', 'designer', 'purchaser']);

export const userInputSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1),
  role: userRoleSchema,
});
