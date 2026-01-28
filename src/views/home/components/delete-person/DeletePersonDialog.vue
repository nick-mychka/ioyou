<script setup lang="ts">
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import DeletePersonDialogContent from './DeletePersonDialogContent.vue';

const open = defineModel<boolean>('open', { required: true });

const { personId } = defineProps<{
  personId: string;
}>();

const emit = defineEmits<{
  deleted: [];
}>();

const closeDialog = () => {
  open.value = false;
};
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent>
      <DeletePersonDialogContent :person-id="personId" @close="closeDialog" @deleted="emit('deleted')" />
    </AlertDialogContent>
  </AlertDialog>
</template>
