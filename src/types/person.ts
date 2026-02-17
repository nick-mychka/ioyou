import { z } from 'zod';

export const PersonSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  createdBy: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Person = z.infer<typeof PersonSchema>;

export const CreatePersonSchema = PersonSchema.pick({ name: true, description: true });
export type CreatePersonForm = z.infer<typeof CreatePersonSchema>;
export type UpdatePersonForm = Partial<CreatePersonForm>;
