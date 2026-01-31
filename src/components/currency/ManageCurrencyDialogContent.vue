<script setup lang="ts">
import { ref, computed } from 'vue';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash2, Edit2, EllipsisVertical } from 'lucide-vue-next';
import { currencyService } from '@/services/CurrencyService';
import type { Currency } from '@/types/currency';

const emit = defineEmits<{
  close: [];
}>();

const currencies = ref<Currency[]>(currencyService.getAll());
const newCurrencyName = ref('');
const editingId = ref<number | null>(null);
const editingName = ref('');

const isAddDisabled = computed(() => {
  return newCurrencyName.value.trim() === '';
});

const handleAdd = () => {
  if (isAddDisabled.value) return;

  try {
    currencyService.create({
      name: newCurrencyName.value.trim(),
      is_default: false,
    });
    currencies.value = currencyService.getAll();
    newCurrencyName.value = '';
  } catch (error) {
    console.error('Failed to add currency:', error);
    alert(error instanceof Error ? error.message : 'Failed to add currency');
  }
};

const handleEdit = (currency: Currency) => {
  editingId.value = currency.id;
  editingName.value = currency.name;
};

const handleSaveEdit = (id: number) => {
  if (editingName.value.trim() === '') {
    editingId.value = null;
    return;
  }

  // Check for duplicates (excluding current currency)
  const isDuplicate = currencies.value.some(
    (c) => c.id !== id && c.name.toLowerCase() === editingName.value.trim().toLowerCase()
  );

  if (isDuplicate) {
    alert('Currency name already exists');
    return;
  }

  try {
    currencyService.update(id, { name: editingName.value.trim() });
    currencies.value = currencyService.getAll();
    editingId.value = null;
    editingName.value = '';
  } catch (error) {
    console.error('Failed to update currency:', error);
    alert(error instanceof Error ? error.message : 'Failed to update currency');
  }
};

const handleCancelEdit = () => {
  editingId.value = null;
  editingName.value = '';
};

const handleDelete = (id: number) => {
  try {
    currencyService.remove(id);
    currencies.value = currencyService.getAll();
  } catch (error) {
    console.error('Failed to delete currency:', error);
    alert(error instanceof Error ? error.message : 'Failed to delete currency');
  }
};

const handleSave = () => {
  emit('close');
};
</script>

<template>
  <DialogHeader>
    <DialogTitle>Manage Currency</DialogTitle>
  </DialogHeader>

  <div class="flex flex-col gap-4 py-4">
    <!-- Add new currency -->
    <div class="flex gap-2">
      <Input
        v-model="newCurrencyName"
        placeholder="Enter currency code (e.g., EUR)"
        @keydown.enter="handleAdd"
      />
      <Button @click="handleAdd" :disabled="isAddDisabled">Add</Button>
    </div>

    <!-- Currency list -->
    <div class="flex max-h-[300px] flex-col gap-2 overflow-y-auto">
      <div
        v-for="currency in currencies"
        :key="currency.id"
        class="flex items-center justify-between rounded-md border bg-muted/50 p-2"
      >
        <div class="flex flex-1 items-center gap-2">
          <template v-if="editingId === currency.id">
            <Input
              v-model="editingName"
              class="h-8 max-w-[120px]"
              @keydown.enter="handleSaveEdit(currency.id)"
              @keydown.esc="handleCancelEdit"
            />
            <div class="flex gap-1">
              <Button size="sm" variant="ghost" @click="handleSaveEdit(currency.id)">Save</Button>
              <Button size="sm" variant="ghost" @click="handleCancelEdit">Cancel</Button>
            </div>
          </template>
          <template v-else>
            <span class="font-medium">{{ currency.name }}</span>
            <Badge v-if="currency.is_default" variant="secondary">Default</Badge>
          </template>
        </div>

        <DropdownMenu v-if="editingId !== currency.id">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <EllipsisVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="handleEdit(currency)">
              <Edit2 class="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              v-if="!currency.is_default"
              variant="destructive"
              @click="handleDelete(currency.id)"
            >
              <Trash2 class="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div v-if="currencies.length === 0" class="py-4 text-center text-muted-foreground">
        No currencies added yet
      </div>
    </div>
  </div>

  <DialogFooter>
    <Button @click="handleSave" class="w-full">Save</Button>
  </DialogFooter>
</template>
