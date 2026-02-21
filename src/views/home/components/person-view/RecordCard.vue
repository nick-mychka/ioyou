<script lang="ts" setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import { CalendarClock } from 'lucide-vue-next';

import { Card, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card';
import { useCurrencyCode } from '@/composables/useCurrencies';
import { formatAmount } from '@/utils/numbers';
import type { PersonRecord } from '@/types/personRecord';

import RecordActions from './RecordActions.vue';
import DeleteRecordDialog from '../delete-record/DeleteRecordDialog.vue';

const { record, personId } = defineProps<{
  record: PersonRecord;
  personId: string;
}>();

const getCurrencyCode = useCurrencyCode();

const isOverdue = computed(() => {
  if (!record.dueDate) return false;
  return dayjs(record.dueDate).isBefore(dayjs(), 'day');
});

const isDeleteDialogOpen = ref(false);
</script>

<template>
  <Card
    :class="[
      'gap-0 overflow-hidden border-l-4 py-0',
      record.kind === 'debt' ? 'border-l-red-400' : 'border-l-green-400',
    ]"
  >
    <CardHeader class="py-4">
      <CardTitle class="flex items-baseline gap-1">
        <span class="text-lg">{{ formatAmount(record.amount) }}</span>
        <span class="text-sm text-muted-foreground">{{ getCurrencyCode(record.currencyId) }}</span>
      </CardTitle>
      <CardDescription class="text-foreground/60">
        {{ dayjs(record.loanDate).format('MMM DD, YYYY') }}
      </CardDescription>
      <CardAction>
        <RecordActions @delete="isDeleteDialogOpen = true" />
      </CardAction>
    </CardHeader>
    <div
      v-if="record.dueDate"
      class="flex items-center gap-1 px-6 pb-3 text-xs"
      :class="isOverdue ? 'font-medium text-orange-500' : 'text-muted-foreground'"
    >
      <CalendarClock class="size-3 shrink-0" />
      <span
        >{{ isOverdue ? 'Overdue' : 'Due' }}
        {{ dayjs(record.dueDate).format('MMM DD, YYYY') }}</span
      >
    </div>
  </Card>

  <DeleteRecordDialog v-model:open="isDeleteDialogOpen" :personId :recordId="record.id" />
</template>
