import { z } from 'zod';

export const demoLoginSchema = z.object({
  email: z.email(),
});
