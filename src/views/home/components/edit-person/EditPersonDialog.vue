<script setup lang="ts">
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EditPersonDialogContent from './EditPersonDialogContent.vue';

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
    <DialogContent>
      <EditPersonDialogContent :person-id="personId" @close="closeDialog" />
    </DialogContent>
  </Dialog>
</template>
