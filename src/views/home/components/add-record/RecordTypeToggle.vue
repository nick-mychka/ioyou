<script lang="ts" setup>
import { BanknoteArrowDown, BanknoteArrowUp } from 'lucide-vue-next';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const kind = defineModel<'debt' | 'loan'>('kind', { required: true });
</script>

<template>
  <ToggleGroup
    v-model="kind"
    variant="outline"
    type="single"
    class="w-full"
    aria-label="Select record type"
  >
    <ToggleGroupItem value="debt" class="flex-1 data-[state=on]:bg-red-400/25" aria-label="Borrow">
      Borrow
      <BanknoteArrowDown />
    </ToggleGroupItem>
    <ToggleGroupItem value="loan" class="flex-1 data-[state=on]:bg-green-400/25" aria-label="Lend">
      Lend
      <BanknoteArrowUp />
    </ToggleGroupItem>
  </ToggleGroup>
</template>
