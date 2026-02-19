<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';
import { type CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldLabel } from '@/components/ui/field';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import CurrencyCombobox from '@/components/currency/CurrencyCombobox.vue';
import { Spinner } from '@/components/ui/spinner';
import { useCreateRecord } from '@/composables/useRecords';

import RecordTypeToggle from './RecordTypeToggle.vue';
import NumericField from './NumericField.vue';
import DateField from './DateField.vue';

const { personId } = defineProps<{
  personId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { mutate: createRecord, isPending } = useCreateRecord(personId, {
  onSuccess: () => {
    emit('close');
  },
});

// Form state
const kind = ref<'debt' | 'loan'>('debt');
const amount = ref<number>(0);
const currency = ref('');
const loanDate = ref<DateValue | undefined>();
const note = ref('');

// Advanced fields
const isAdvancedOpen = ref(false);
const dueDate = ref<CalendarDate | undefined>();
const interestRate = ref<number | null>(null);
const penalty = ref<number | null>(null);

const isSubmitDisabled = computed(() => {
  return isPending.value || !amount.value || amount.value <= 0 || !currency.value.trim() || !loanDate.value;
});

const handleAdd = () => {
  if (isSubmitDisabled.value) return;

  const formatDateToISO = (date: DateValue) => {
    const jsDate = date.toDate(getLocalTimeZone());
    return jsDate.toISOString();
  };

  const loanDateISO = loanDate.value && formatDateToISO(loanDate.value);

  if (!loanDateISO) return;

  const formData = {
    amount: amount.value,
    currencyId: currency.value,
    note: note.value.trim() ?? null,
    loanDate: loanDateISO,
    dueDate: dueDate.value ? formatDateToISO(dueDate.value) : null,
    kind: kind.value,
    interestRate: interestRate.value ?? null,
    penalty: penalty.value ?? null,
  };

  createRecord(formData);
};
</script>

<template>
  <DialogHeader class="border-b pb-4">
    <DialogTitle>Add Record</DialogTitle>
  </DialogHeader>

  <form id="add-record-form" class="flex flex-col gap-6 py-4" @submit.prevent="handleAdd">
    <RecordTypeToggle v-model:kind="kind" />

    <div class="grid grid-cols-2 gap-2">
      <Field>
        <FieldLabel for="amount">Amount</FieldLabel>
        <NumericField v-model="amount" autofocus />
      </Field>
      <Field>
        <FieldLabel for="currency">Currency</FieldLabel>
        <CurrencyCombobox :value="currency" @change="(newCurrency) => (currency = newCurrency)" />
      </Field>
    </div>

    <Field>
      <FieldLabel>Loan date</FieldLabel>
      <DateField v-model:date="loanDate" />
    </Field>

    <Field>
      <FieldLabel for="note">Note</FieldLabel>
      <Textarea v-model="note" id="note" placeholder="Enter note (optional)" rows="2" />
    </Field>

    <Collapsible v-model:open="isAdvancedOpen">
      <CollapsibleTrigger as-child>
        <Button
          variant="outline"
          type="button"
          class="w-full justify-between"
          :aria-expanded="isAdvancedOpen"
          aria-controls="advanced-fields"
          disabled
        >
          Advanced Fields
          <ChevronDown
            class="transition-transform duration-200"
            :class="{ 'rotate-180': isAdvancedOpen }"
            aria-hidden="true"
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent id="advanced-fields" class="mt-4 flex flex-col gap-4">
        <Field>
          <FieldLabel>Due date</FieldLabel>
          <DateField v-model:date="dueDate" />
        </Field>

        <div class="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel for="interest-rate">Interest rate (%)</FieldLabel>
            <NumericField v-model="interestRate" />
          </Field>
          <Field>
            <FieldLabel for="penalty">Penalty</FieldLabel>
            <NumericField v-model="penalty" />
          </Field>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </form>

  <DialogFooter class="border-t pt-4">
    <Button variant="outline" @click="emit('close')" class="min-w-24">Cancel</Button>
    <Button type="submit" form="add-record-form" :disabled="isSubmitDisabled" class="min-w-32">
      <Spinner v-if="isPending" /> Add
    </Button>
  </DialogFooter>
</template>
