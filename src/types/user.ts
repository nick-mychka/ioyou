import z from 'zod';

export const UserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  createdAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
