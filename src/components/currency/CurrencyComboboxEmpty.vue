<script lang="ts" setup>
import { computed } from 'vue';
import { Plus } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CommandEmpty, useCommand } from '@/components/ui/command';
import { useCreateCurrency } from '@/composables/useCurrencies';
import type { Currency } from '@/types/currency';

const emit = defineEmits<{
  created: [currencyId: string];
}>();

const { filterState } = useCommand();

const currencyCode = computed(() => filterState.search.toUpperCase());

const { mutate: createCurrency, isPending } = useCreateCurrency({
  onSuccess: (currency: Currency) => {
    emit('created', currency.id);
  },
});

const handleCreate = async () => {
  if (isPending.value) return;

  createCurrency({ code: currencyCode.value });
};
</script>

<template>
  <CommandEmpty class="flex flex-col items-center gap-3 text-center">
    <p class="text-muted-foreground">No currency found.</p>
    <Button variant="outline" size="sm" :disabled="isPending" @click="handleCreate">
      <Spinner v-if="isPending" />
      <Plus v-else />
      Add
    </Button>
  </CommandEmpty>
</template>
