import { z } from 'zod';

export const announcementInputSchema = z.object({
  title: z.string().trim().min(1),
  body: z.string().trim().min(1),
});
