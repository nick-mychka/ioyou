<script lang="ts" setup>
import { ref } from 'vue';
import { Receipt, Plus } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import AddRecordDialog from '../add-record/AddRecordDialog.vue';

const { personId } = defineProps<{
  personId: string;
}>();

const isAddRecordDialogOpen = ref(false);
</script>

<template>
  <Empty>
    <EmptyMedia variant="icon">
      <Receipt />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>No records yet</EmptyTitle>
      <EmptyDescription>
        Add your first record to start tracking loans and debts for this person.
      </EmptyDescription>
    </EmptyHeader>
    <Button @click="isAddRecordDialogOpen = true">
      <Plus />
      Add Record
    </Button>
    <AddRecordDialog v-model:open="isAddRecordDialogOpen" :personId />
  </Empty>
</template>
