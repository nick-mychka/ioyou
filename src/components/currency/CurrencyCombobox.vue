<script setup lang="ts">
import { computed, ref } from 'vue';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/utils/shadcn';
import { useCurrencies } from '@/composables/useCurrencies';

const { value } = defineProps<{
  value: string;
}>();

const emit = defineEmits<{
  change: [value: string];
}>();

const isOpen = ref(false);

const { data: currencies } = useCurrencies();

const selectedCurrency = computed(() => {
  console.log('currencies', currencies.value);
  return currencies.value?.find((c) => c.id === value)?.code ?? 'Select currency';
});
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="isOpen"
        class="w-full justify-between"
      >
        {{ selectedCurrency }}
        <ChevronsUpDownIcon class="opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-50 p-0">
      <Command>
        <CommandInput class="h-9" placeholder="Search currency..." />
        <CommandList>
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            <CommandItem
              v-for="currency in currencies"
              :key="currency.id"
              :value="currency.id"
              @select="emit('change', currency.id)"
            >
              {{ currency.code || 'cck' }}
              <CheckIcon
                :class="cn('ml-auto', value === currency.id ? 'opacity-100' : 'opacity-0')"
              />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
