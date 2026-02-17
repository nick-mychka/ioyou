<script setup lang="ts">
import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { useRemoveRecord } from '@/composables/useRecords';

const { personId, recordId } = defineProps<{
  personId: string;
  recordId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { mutate: remove, isPending } = useRemoveRecord(personId, {
  onSuccess: () => {
    emit('close');
  },
});

const handleDelete = () => {
  if (isPending.value) return;
  remove(recordId);
};
</script>

<template>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This record will be permanently deleted. This action cannot be undone.
    </AlertDialogDescription>
  </AlertDialogHeader>

  <AlertDialogFooter>
    <AlertDialogCancel @click="emit('close')">Cancel</AlertDialogCancel>
    <AlertDialogAction variant="destructive" @click="handleDelete" :disabled="isPending">
      <Spinner v-if="isPending" /> Delete
    </AlertDialogAction>
  </AlertDialogFooter>
</template>
