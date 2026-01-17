<script setup lang="ts">
import { ref } from 'vue';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const name = ref('');
const description = ref('');

const handleAdd = () => {
  const trimmedName = name.value.trim();

  if (trimmedName === '') {
    return;
  }

  console.log({
    name: trimmedName,
    description: description.value.trim(),
  });

  name.value = '';
  description.value = '';
  emit('update:open', false);
};

const handleCancel = () => {
  name.value = '';
  description.value = '';

  emit('update:open', false);
};
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Person</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div>
          <label class="mb-2 block text-sm font-medium">Name</label>
          <Input v-model="name" placeholder="Enter name" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">Description</label>
          <Textarea v-model="description" placeholder="Enter description (optional)" rows="4" />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">Cancel</Button>
        <Button @click="handleAdd" :disabled="name.trim() === ''">Add</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
