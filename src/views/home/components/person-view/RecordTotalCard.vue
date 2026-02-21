<script lang="ts" setup>
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCurrencyCode } from '@/composables/useCurrencies';
import { formatAmount } from '@/utils/numbers';
import type { PersonRecordTotal } from '@/types/personRecord';

const { total } = defineProps<{
  total: PersonRecordTotal;
}>();

const getCurrencyCode = useCurrencyCode();
</script>

<template>
  <Card
    :class="[
      'gap-0 overflow-hidden border-b-4 py-0',
      total.kind === 'debt' ? 'border-b-red-400 bg-red-400/5' : 'border-b-green-400 bg-green-400/5',
    ]"
  >
    <CardHeader class="py-3">
      <CardDescription class="text-foreground/60">
        {{ total.kind === 'debt' ? 'Total Borrowed' : 'Total Lent' }}
      </CardDescription>
      <CardTitle class="flex items-baseline gap-1">
        <span class="text-xl">{{ formatAmount(total.total) }}</span>
        <span class="text-sm text-muted-foreground">{{ getCurrencyCode(total.currencyId) }}</span>
      </CardTitle>
    </CardHeader>
  </Card>
</template>
