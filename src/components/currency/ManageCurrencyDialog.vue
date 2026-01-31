<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ManageCurrencyDialogContent from './ManageCurrencyDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-md">
      <ManageCurrencyDialogContent @close="closeDialog" />
    </DialogContent>
  </Dialog>
</template>
