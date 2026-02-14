import { z } from 'zod';

export const CurrencySchema = z.object({
  id: z.number(),
  name: z.string(),
  is_default: z.boolean(),
});

export type Currency = z.infer<typeof CurrencySchema>;

export const CreateCurrencySchema = CurrencySchema.omit({
  id: true,
});

export type CreateCurrencyForm = z.infer<typeof CreateCurrencySchema>;
