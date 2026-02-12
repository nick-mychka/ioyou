<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { Person } from '@/types/person';

import EditPersonDialogContent from './EditPersonDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const { person } = defineProps<{
  person: Person | undefined;
}>();

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <EditPersonDialogContent v-if="person" :person="person" @close="closeDialog" />
    </DialogContent>
  </Dialog>
</template>
