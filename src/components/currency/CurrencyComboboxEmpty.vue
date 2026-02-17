<script lang="ts" setup>
import { computed } from 'vue';
import { Plus } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { useCommand } from '@/components/ui/command';
import { useCreateCurrency } from '@/composables/useCurrencies';

const emit = defineEmits<{
  created: [currencyId: string];
}>();

const { filterState } = useCommand();

const isRender = computed(() => !!filterState.search && filterState.filtered.count === 0);
const currencyCode = computed(() => filterState.search.toUpperCase());

const { mutateAsync: createCurrency, isPending } = useCreateCurrency();

const handleCreate = async () => {
  if (isPending.value) return;

  const currency = await createCurrency({ code: currencyCode.value });
  filterState.search = '';
  emit('created', currency.id);
};
</script>

<template>
  <div v-if="isRender" class="flex flex-col items-center gap-2 py-6 text-center text-sm">
    <p class="text-muted-foreground">No currency found.</p>
    <Button variant="outline" size="sm" :disabled="isPending" @click="handleCreate">
      <Plus />
      Add
    </Button>
  </div>
</template>
