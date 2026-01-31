import { z } from 'zod';

export const recordSchema = z.object({
  id: z.number(),
  amount: z.number(),
  currency: z.string(),
  note: z.string().nullable(),
  loan_date: z.string(), // ISO date string
  due_date: z.string().nullable(), // ISO date string
  kind: z.enum(['lend', 'borrow']),
  status: z.enum(['active', 'inactive']),
  interest_rate: z.number().nullable(),
  penalty: z.number().nullable(),
  person_id: z.number(),
});

export type Record = z.infer<typeof recordSchema>;

export const createRecordSchema = recordSchema.omit({
  id: true,
});

export type CreateRecordForm = z.infer<typeof createRecordSchema>;
