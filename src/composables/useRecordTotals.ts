import { computed, type MaybeRef, toValue } from 'vue';
import { groupBy } from 'es-toolkit';
import type { PersonRecord } from '@/types/personRecord';

export type RecordTotal = {
  kind: 'debt' | 'loan';
  currencyId: string;
  total: number;
};

export function useRecordTotals(records: MaybeRef<PersonRecord[] | undefined>) {
  return computed<RecordTotal[]>(() => {
    const data = toValue(records);
    if (!data || data.length === 0) return [];

    const byKind = groupBy(data, (r) => r.kind);
    const totals: RecordTotal[] = [];

    for (const [kind, kindRecords] of Object.entries(byKind)) {
      const byCurrency = groupBy(kindRecords, (r) => r.currencyId);

      for (const [currencyId, currencyRecords] of Object.entries(byCurrency)) {
        const total = currencyRecords.reduce((sum, r) => sum + r.amount, 0);
        totals.push({ kind: kind as 'debt' | 'loan', currencyId, total });
      }
    }

    return totals.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'loan' ? -1 : 1;
      return 0;
    });
  });
}
