import { computed, type MaybeRef, toValue } from 'vue';
import { groupBy, pick, sortBy } from 'es-toolkit';

import type { PersonRecord, PersonRecordTotal } from '@/types/personRecord';

export function useRecordTotals(records: MaybeRef<PersonRecord[] | undefined>) {
  return computed<PersonRecordTotal[]>(() => {
    const data = toValue(records);
    if (!data || data.length === 0) return [];

    const byKind = groupBy(data, (r) => r.kind);
    const totals: PersonRecordTotal[] = [];

    Object.values(byKind).forEach((recordsByKind) => {
      const byCurrency = groupBy(recordsByKind, (r) => r.currencyId);

      Object.values(byCurrency).forEach((recordsByCurrency) => {
        const total = recordsByCurrency.reduce((sum, r) => sum + r.amount, 0);
        if (recordsByCurrency[0]) {
          totals.push({ ...pick(recordsByCurrency[0], ['kind', 'currencyId']), total });
        }
      });
    });

    return sortBy(totals, ['kind']);
  });
}
