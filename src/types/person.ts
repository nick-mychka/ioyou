import { z } from 'zod';

export const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export type Person = z.infer<typeof personSchema>;

export const createPersonSchema = personSchema.omit({ id: true });

export type CreatePersonForm = z.infer<typeof createPersonSchema>;

export const updatePersonSchema = createPersonSchema.partial();

export type UpdatePersonForm = z.infer<typeof updatePersonSchema>;
