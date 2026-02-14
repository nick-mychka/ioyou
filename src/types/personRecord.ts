import { z } from 'zod';

export const PersonRecordSchema = z.object({
  id: z.uuid(),
  amount: z.string(),
  currencyId: z.uuid(),
  note: z.string().nullable(),
  loanDate: z.iso.date(),
  dueDate: z.iso.date().nullable(),
  kind: z.enum(['loan', 'debt']),
  statusId: z.uuid(),
  interestRate: z.string().nullable(),
  penalty: z.string().nullable(),
  personId: z.uuid(),
});

export type PersonRecord = z.infer<typeof PersonRecordSchema>;

export const CreatePersonRecordSchema = PersonRecordSchema.pick({
  amount: true,
  currencyId: true,
  note: true,
  loanDate: true,
  dueDate: true,
  kind: true,
  statusId: true,
  interestRate: true,
  penalty: true,
});

export type CreatePersonRecordForm = z.infer<typeof CreatePersonRecordSchema>;
export type UpdatePersonRecordForm = Partial<CreatePersonRecordForm>;
