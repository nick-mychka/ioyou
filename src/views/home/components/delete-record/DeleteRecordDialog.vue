<script setup lang="ts">
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

import DeleteRecordDialogContent from './DeleteRecordDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const { personId, recordId } = defineProps<{
  personId: string;
  recordId: string | null;
}>();

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent>
      <DeleteRecordDialogContent v-if="recordId" :personId :recordId @close="closeDialog" />
    </AlertDialogContent>
  </AlertDialog>
</template>
