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
}>();

const { mutate: remove, isPending } = useRemovePerson({
  onSuccess: () => {
    emit('close');
  },
});

const handleDelete = () => {
  if (isPending.value) return;
  remove(personId);
};
</script>

<template>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This person will be permanently deleted from your list. This action cannot be undone.
    </AlertDialogDescription>
  </AlertDialogHeader>

  <AlertDialogFooter>
    <AlertDialogCancel @click="emit('close')">Cancel</AlertDialogCancel>
    <AlertDialogAction variant="destructive" @click="handleDelete" :disabled="isPending">
      <Spinner v-if="isPending" /> Delete
    </AlertDialogAction>
  </AlertDialogFooter>
</template>
