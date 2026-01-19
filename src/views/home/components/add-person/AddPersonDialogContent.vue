<script setup lang="ts">
import { computed, ref } from 'vue';

import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useCreatePerson } from '@/composables/usePeople';

const { onClose } = defineProps<{
  onClose: () => void;
}>();

const {
  mutate: create,
  isPending: isCreating,
  error,
} = useCreatePerson({
  onSuccess: () => {
    onClose();
  },
});

const name = ref('');
const description = ref('');

const isSubmitDisabled = computed(() => isCreating.value || name.value.trim() === '');

const handleAdd = () => {
  if (isSubmitDisabled.value) return;

  create({
    name: name.value.trim(),
    description: description.value.trim(),
  });
};
</script>

<template>
  <DialogHeader>
    <DialogTitle>Add Person</DialogTitle>
  </DialogHeader>

  <form id="add-person-form" class="flex flex-col gap-6 py-2" @submit.prevent="handleAdd">
    <Field>
      <FieldLabel for="name">Name</FieldLabel>
      <Input v-model="name" id="name" placeholder="Enter name" />
    </Field>

    <Field>
      <FieldLabel for="description">Description</FieldLabel>
      <Textarea
        v-model="description"
        id="description"
        placeholder="Enter description (optional)"
        rows="4"
      />
      <FieldError v-if="error" :message="error.message" />
    </Field>
  </form>

  <DialogFooter>
    <Button variant="outline" @click="onClose">Cancel</Button>
    <Button type="submit" form="add-person-form" :disabled="isSubmitDisabled">
      <Spinner v-if="isCreating" /> Add
    </Button>
  </DialogFooter>
</template>
