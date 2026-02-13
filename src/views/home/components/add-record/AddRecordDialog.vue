<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog';

import AddRecordDialogContent from './AddRecordDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const { personId } = defineProps<{
  personId: string;
}>();

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <AddRecordDialogContent :personId @close="closeDialog" />
    </DialogContent>
  </Dialog>
</template>
