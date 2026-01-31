<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-vue-next';
import { currencyService } from '@/services/CurrencyService';
import type { Currency } from '@/types/currency';

const modelValue = defineModel<string>({ required: true });

const emit = defineEmits<{
  'open-manage': [];
}>();

const refreshCurrencies = () => {
  currencies.value = currencyService.getAll();
};

defineExpose({
  refreshCurrencies,
});

const inputRef = ref<InstanceType<typeof Input> | null>(null);
const dropdownRef = ref<HTMLDivElement | null>(null);
const inputValue = ref(modelValue.value);
const isOpen = ref(false);
const currencies = ref<Currency[]>(currencyService.getAll());
const isFocused = ref(false);

// Sync modelValue with inputValue
watch(modelValue, (newValue) => {
  inputValue.value = newValue;
});

watch(inputValue, (newValue, oldValue) => {
  modelValue.value = newValue;
  // Open dropdown ONLY when user types (value changed) and input is focused
  if (!isOpen.value && isFocused.value && newValue !== oldValue) {
    isOpen.value = true;
  }
});

const filteredCurrencies = computed(() => {
  if (!inputValue.value) return currencies.value;
  return currencyService.search(inputValue.value);
});

const showAddTag = computed(() => {
  if (!inputValue.value.trim()) return false;
  const exists = currencies.value.some(
    (c) => c.name.toLowerCase() === inputValue.value.toLowerCase()
  );
  return !exists;
});

const handleSelectCurrency = (currency: Currency) => {
  inputValue.value = currency.name;
  modelValue.value = currency.name;
  isOpen.value = false;
};

const handleAddTag = () => {
  if (!inputValue.value.trim()) return;

  try {
    currencyService.create({
      name: inputValue.value.trim(),
      is_default: false,
    });
    currencies.value = currencyService.getAll();
    modelValue.value = inputValue.value.toUpperCase();
    isOpen.value = false;
  } catch (error) {
    console.error('Failed to add currency:', error);
  }
};

const handleOpenManage = (e: Event) => {
  e.stopPropagation();
  isOpen.value = false;
  emit('open-manage');
};

const handleInputFocus = () => {
  isFocused.value = true;
};

const handleInputBlur = () => {
  isFocused.value = false;
  // Delay closing to allow clicking on dropdown items
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const dropdownEl = dropdownRef.value;

  if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative">
    <div class="relative">
      <Input
        ref="inputRef"
        v-model="inputValue"
        placeholder="USD"
        class="pr-8"
        role="combobox"
        :aria-expanded="isOpen"
        aria-autocomplete="list"
        aria-controls="currency-listbox"
        aria-label="Currency"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
      />
      <Button
        size="icon"
        variant="ghost"
        type="button"
        class="absolute top-0 right-0 h-full w-8 hover:bg-transparent"
        @click="handleOpenManage"
        title="Manage currencies"
      >
        <Settings class="h-3.5 w-3.5" />
      </Button>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      ref="dropdownRef"
      id="currency-listbox"
      role="listbox"
      class="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 text-popover-foreground shadow-md"
    >
      <div class="flex flex-col gap-1">
        <!-- Search results -->
        <template v-if="filteredCurrencies.length > 0">
          <button
            v-for="currency in filteredCurrencies"
            :key="currency.id"
            type="button"
            role="option"
            :aria-selected="currency.name === inputValue"
            class="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted"
            @mousedown.prevent="handleSelectCurrency(currency)"
          >
            <span>{{ currency.name }}</span>
            <span v-if="currency.is_default" class="text-xs text-muted-foreground"> Default </span>
          </button>
        </template>

        <!-- Add tag button -->
        <Button
          v-if="showAddTag"
          variant="outline"
          size="sm"
          type="button"
          class="w-full"
          @mousedown.prevent="handleAddTag"
        >
          Add "{{ inputValue.toUpperCase() }}"
        </Button>

        <!-- Manage currency button -->
        <Button
          variant="ghost"
          size="sm"
          type="button"
          class="w-full justify-start gap-2"
          @mousedown.prevent="handleOpenManage"
        >
          <Settings class="h-4 w-4" />
          Manage Currency
        </Button>
      </div>
    </div>
  </div>
</template>
