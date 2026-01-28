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
import { useRemovePerson } from '@/composables/usePeople';

const { personId } = defineProps<{
  personId: string;
}>();

const emit = defineEmits<{
  close: [];
  deleted: [];
}>();

const { mutate: remove, isPending: isDeleting } = useRemovePerson({
  onSuccess: () => {
    emit('deleted');
    emit('close');
  },
});

const handleDelete = () => {
  if (isDeleting.value) return;
  remove(personId);
};
</script>

<template>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone. This person will be permanently deleted from your list.
    </AlertDialogDescription>
  </AlertDialogHeader>

  <AlertDialogFooter>
    <AlertDialogCancel @click="emit('close')">Cancel</AlertDialogCancel>
    <AlertDialogAction variant="destructive" @click="handleDelete" :disabled="isDeleting">
      <Spinner v-if="isDeleting" /> Delete
    </AlertDialogAction>
  </AlertDialogFooter>
</template>
