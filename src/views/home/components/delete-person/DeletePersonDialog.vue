<script setup lang="ts">
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

import DeletePersonDialogContent from './DeletePersonDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const { personId } = defineProps<{
  personId: string | null;
}>();

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent>
      <DeletePersonDialogContent v-if="personId" :personId @close="closeDialog" />
    </AlertDialogContent>
  </AlertDialog>
</template>
