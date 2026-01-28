<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import { useUpdatePerson, usePerson } from '@/composables/usePeople';

const { personId } = defineProps<{
  personId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { data: person, isLoading: isLoadingPerson } = usePerson(personId);

const name = ref('');
const description = ref('');

watch(
  person,
  (newPerson) => {
    if (newPerson) {
      name.value = newPerson.name;
      description.value = newPerson.description || '';
    }
  },
  { immediate: true }
);

const updateMutation = useUpdatePerson({
  onSuccess: () => {
    emit('close');
  },
});

const { mutate: update, isPending: isUpdating } = updateMutation;

const errorMessage = computed(() => {
  if (!updateMutation.error.value) return null;
  const err = updateMutation.error.value;
  return err instanceof Error ? err.message : 'Failed to update person';
});

const isSubmitDisabled = computed(
  () => isUpdating.value || name.value.trim() === '' || isLoadingPerson.value
);

const handleSave = () => {
  if (isSubmitDisabled.value) return;

  update({
    id: personId,
    data: {
      name: name.value.trim(),
      description: description.value.trim() || null,
    },
  });
};
</script>

<template>
  <DialogHeader>
    <DialogTitle>Edit Person</DialogTitle>
  </DialogHeader>

  <div v-if="isLoadingPerson" class="flex justify-center py-8">
    <Spinner />
  </div>

  <form
    v-else
    id="edit-person-form"
    class="flex flex-col gap-6 py-2"
    @submit.prevent="handleSave"
  >
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
      <FieldError v-if="errorMessage" :message="errorMessage" />
    </Field>
  </form>

  <DialogFooter>
    <Button variant="outline" @click="emit('close')">Cancel</Button>
    <Button type="submit" form="edit-person-form" :disabled="isSubmitDisabled">
      <Spinner v-if="isUpdating" /> Save
    </Button>
  </DialogFooter>
</template>
