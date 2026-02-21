import { z } from 'zod';

const RecordKindSchema = z.enum(['loan', 'debt']);
export type RecordKind = z.infer<typeof RecordKindSchema>;

const DecimalString = z.string().transform((val) => parseFloat(val));

export const PersonRecordSchema = z.object({
  id: z.uuid(),
  amount: DecimalString,
  currencyId: z.uuid(),
  note: z.string().nullable(),
  loanDate: z.iso.datetime(),
  dueDate: z.iso.datetime().nullable(),
  kind: RecordKindSchema,
  statusId: z.uuid(),
  interestRate: DecimalString.nullable(),
  penalty: DecimalString.nullable(),
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
  interestRate: true,
  penalty: true,
});

export type CreatePersonRecordForm = z.infer<typeof CreatePersonRecordSchema>;
export type UpdatePersonRecordForm = Partial<CreatePersonRecordForm>;

export type PersonRecordTotal = Pick<PersonRecord, 'kind' | 'currencyId'> & {
  total: number;
};
