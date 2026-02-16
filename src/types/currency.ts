import { z } from 'zod';

export const CurrencySchema = z.object({
  id: z.uuid(),
  code: z.string(),
});

export type Currency = z.infer<typeof CurrencySchema>;

export const CreateCurrencySchema = CurrencySchema.pick({
  code: true,
});

export type CreateCurrencyForm = z.infer<typeof CreateCurrencySchema>;
