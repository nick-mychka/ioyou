import { z } from 'zod';

export const personSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Person = z.infer<typeof personSchema>;

export const createPersonSchema = personSchema.pick({ name: true, description: true });
export type CreatePersonForm = z.infer<typeof createPersonSchema>;
export type UpdatePersonForm = Partial<CreatePersonForm>;
