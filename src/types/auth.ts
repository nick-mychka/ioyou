import { z } from 'zod';
import { UserSchema } from './user';

export const SigninFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type SigninForm = z.infer<typeof SigninFormSchema>;

export const SignupFormSchema = z.object({
  ...SigninFormSchema.shape,
  name: z.string().min(2),
});

export type SignupForm = z.infer<typeof SignupFormSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
