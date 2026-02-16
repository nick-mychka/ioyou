<script lang="ts" setup>
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';

const model = defineModel<number | null>({ required: true });

const { autofocus } = defineProps<{
  autofocus?: boolean;
}>();
</script>

<template>
  <NumberField v-model="model" :min="0" :step="1" :format-options="{ maximumFractionDigits: 2 }">
    <NumberFieldContent>
      <NumberFieldDecrement />
      <NumberFieldInput placeholder="0.00" :autofocus />
      <NumberFieldIncrement />
    </NumberFieldContent>
  </NumberField>
</template>
