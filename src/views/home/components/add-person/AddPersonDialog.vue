<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog';

import AddPersonDialogContent from './AddPersonDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <AddPersonDialogContent @close="closeDialog" />
    </DialogContent>
  </Dialog>
</template>
