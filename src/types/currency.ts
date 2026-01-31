import { z } from 'zod';

export const currencySchema = z.object({
  id: z.number(),
  name: z.string(),
  is_default: z.boolean(),
});

export type Currency = z.infer<typeof currencySchema>;

export const createCurrencySchema = currencySchema.omit({
  id: true,
});

export type CreateCurrencyForm = z.infer<typeof createCurrencySchema>;
