<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCurrencyCode } from '@/composables/useCurrencies';
import type { PersonRecord } from '@/types/personRecord';

import RecordActions from './RecordActions.vue';
import DeleteRecordDialog from '../delete-record/DeleteRecordDialog.vue';

const { record, personId } = defineProps<{
  record: PersonRecord;
  personId: string;
}>();

const getCurrencyCode = useCurrencyCode();

const isDeleteDialogOpen = ref(false);
</script>

<template>
  <Card
    :class="[
      'gap-0 py-0 overflow-hidden border-l-4',
      record.kind === 'debt' ? 'border-l-red-400' : 'border-l-green-400',
    ]"
  >
    <CardHeader class="py-4">
      <CardTitle class="flex items-center gap-2 text-lg">
        {{ record.amount }} {{ getCurrencyCode(record.currencyId) }}
        <Badge
          :class="
            record.kind === 'debt'
              ? 'bg-red-400/25 text-red-600 border-transparent'
              : 'bg-green-400/25 text-green-600 border-transparent'
          "
        >
          {{ record.kind === 'debt' ? 'Borrow' : 'Lend' }}
        </Badge>
      </CardTitle>
      <CardDescription>
        {{ dayjs(record.loanDate).format('MMMM DD, YYYY') }}
      </CardDescription>
      <CardAction>
        <RecordActions @delete="isDeleteDialogOpen = true" />
      </CardAction>
    </CardHeader>
  </Card>

  <DeleteRecordDialog
    v-model:open="isDeleteDialogOpen"
    :personId
    :recordId="record.id"
  />
</template>
