<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronDown } from 'lucide-vue-next';
import { CurrencyCombobox, ManageCurrencyDialog } from '@/components/currency';
import { DateFormatter, type CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { CreatePersonRecordSchema } from '@/types/personRecord';

const { personId } = defineProps<{
  personId: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

// Form state
const kind = ref<'borrow' | 'lend'>('borrow');
const amount = ref<number>(0);
const currency = ref('USD');
const loanDate = ref<CalendarDate>(today(getLocalTimeZone()));
const note = ref('');

// Advanced fields
const isAdvancedOpen = ref(false);
const dueDate = ref<CalendarDate | undefined>();
const interestRate = ref<number>(0);
const penalty = ref<number>(0);

// Date formatter for display
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
});

// Currency management
const isManageCurrencyOpen = ref(false);
const currencyComboboxRef = ref<InstanceType<typeof CurrencyCombobox> | null>(null);

// Refresh currencies when Manage dialog closes
watch(isManageCurrencyOpen, (newValue) => {
  if (!newValue && currencyComboboxRef.value) {
    currencyComboboxRef.value.refreshCurrencies();
  }
});

const isSubmitDisabled = computed(() => {
  return !amount.value || amount.value <= 0;
});

const handleAdd = () => {
  if (isSubmitDisabled.value) return;

  // Additional validation
  if (!currency.value?.trim()) {
    alert('Currency is required');
    return;
  }

  if (dueDate.value && loanDate.value && dueDate.value.compare(loanDate.value) < 0) {
    alert('Due date cannot be before loan date');
    return;
  }

  // Format dates properly to ISO strings
  const formatDateToISO = (date: unknown): string => {
    const jsDate = date.toDate(getLocalTimeZone());
    return jsDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const parsedPersonId = parseInt(personId, 10);
  if (isNaN(parsedPersonId)) {
    alert('Invalid person ID');
    return;
  }

  const formData = {
    person_id: parsedPersonId,
    kind: kind.value,
    amount: amount.value,
    currency: currency.value.trim(),
    loan_date: formatDateToISO(loanDate.value),
    note: note.value.trim() || null,
    due_date: dueDate.value ? formatDateToISO(dueDate.value) : null,
    interest_rate: interestRate.value || null,
    penalty: penalty.value || null,
    status: 'active' as const,
  };

  try {
    // Validate with Zod schema
    const validated = CreatePersonRecordSchema.parse(formData);
    console.log('Validated record data:', validated);

    // TODO: Send to API
    emit('close');
  } catch (error) {
    console.error('Validation failed:', error);
    alert('Failed to create record. Please check your input.');
  }
};
</script>

<template>
  <DialogHeader class="border-b pb-4">
    <DialogTitle>Add Record</DialogTitle>
  </DialogHeader>

  <form id="add-record-form" class="flex flex-col gap-6 py-4" @submit.prevent="handleAdd">
    <!-- Borrow / Lend Toggle -->
    <ToggleGroup v-model="kind" type="single" class="w-full" aria-label="Select record type">
      <ToggleGroupItem
        value="borrow"
        class="flex-1 transition-all data-[state=on]:bg-primary data-[state=on]:font-semibold data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm"
        aria-label="Borrow"
      >
        Borrow
      </ToggleGroupItem>
      <ToggleGroupItem
        value="lend"
        class="flex-1 transition-all data-[state=on]:bg-primary data-[state=on]:font-semibold data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm"
        aria-label="Lend"
      >
        Lend
      </ToggleGroupItem>
    </ToggleGroup>

    <!-- Amount + Currency -->
    <div class="grid grid-cols-2 gap-2">
      <Field>
        <FieldLabel for="amount">Amount</FieldLabel>
        <NumberField
          v-model="amount"
          :min="0"
          :step="0.01"
          :format-options="{ minimumFractionDigits: 2 }"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput placeholder="0.00" autofocus />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </Field>
      <Field>
        <FieldLabel for="currency">Currency</FieldLabel>
        <CurrencyCombobox
          ref="currencyComboboxRef"
          v-model="currency"
          @open-manage="isManageCurrencyOpen = true"
        />
      </Field>
    </div>

    <!-- Loan date -->
    <Field>
      <FieldLabel>Loan date</FieldLabel>
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="[
              'w-full justify-start text-left font-normal',
              !loanDate && 'text-muted-foreground',
            ]"
            aria-label="Select loan date"
          >
            <CalendarIcon class="mr-2" />
            {{ loanDate ? df.format(loanDate.toDate(getLocalTimeZone())) : 'Pick a date' }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" role="dialog" aria-label="Loan date picker">
          <Calendar v-model="loanDate as any" initial-focus />
        </PopoverContent>
      </Popover>
    </Field>

    <!-- Note -->
    <Field>
      <FieldLabel for="note">Note</FieldLabel>
      <Textarea v-model="note" id="note" placeholder="Enter note (optional)" rows="2" />
    </Field>

    <!-- Advanced Fields (Collapsible) -->
    <Collapsible v-model:open="isAdvancedOpen">
      <CollapsibleTrigger as-child>
        <Button
          variant="outline"
          type="button"
          class="w-full justify-between"
          :aria-expanded="isAdvancedOpen"
          aria-controls="advanced-fields"
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
        <!-- Due date -->
        <Field>
          <FieldLabel>Due date</FieldLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="[
                  'w-full justify-start text-left font-normal',
                  !dueDate && 'text-muted-foreground',
                ]"
                aria-label="Select due date"
              >
                <CalendarIcon class="mr-2" />
                {{
                  dueDate ? df.format(dueDate.toDate(getLocalTimeZone())) : 'Pick a date (optional)'
                }}
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" role="dialog" aria-label="Due date picker">
              <Calendar v-model="dueDate as any" initial-focus />
            </PopoverContent>
          </Popover>
        </Field>

        <!-- Interest rate + Penalty -->
        <div class="grid grid-cols-2 gap-2">
          <Field>
            <FieldLabel for="interest-rate">Interest rate (%)</FieldLabel>
            <NumberField v-model="interestRate" :min="0" :step="0.01">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput placeholder="0.00" />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </Field>
          <Field>
            <FieldLabel for="penalty">Penalty</FieldLabel>
            <NumberField v-model="penalty" :min="0" :step="0.01">
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput placeholder="0.00" />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </Field>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </form>

  <DialogFooter class="border-t pt-4">
    <Button variant="outline" @click="emit('close')" class="min-w-24">Cancel</Button>
    <Button type="submit" form="add-record-form" :disabled="isSubmitDisabled" class="min-w-32">
      Add
    </Button>
  </DialogFooter>

  <ManageCurrencyDialog v-model:open="isManageCurrencyOpen" />
</template>
