<script setup lang="ts">
import { computed, ref } from 'vue';
import { Plus } from 'lucide-vue-next';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { usePerson } from '@/composables/usePeople';
import { useRecords } from '@/composables/useRecords';
import { useRecordTotals } from '@/composables/useRecordTotals';

import PeopleActions from '../people/PeopleActions.vue';
import RecordCard from './RecordCard.vue';
import RecordTotalCard from './RecordTotalCard.vue';
import RecordsEmpty from './RecordsEmpty.vue';
import AddRecordDialog from '../add-record/AddRecordDialog.vue';
import EditPersonDialog from '../edit-person/EditPersonDialog.vue';
import DeletePersonDialog from '../delete-person/DeletePersonDialog.vue';

const { personId } = defineProps<{
  personId: string;
}>();

const { data: person, isLoading } = usePerson(personId);
const { data: records, isLoading: isRecordsLoading } = useRecords(personId);

const totals = useRecordTotals(records);
const lendRecords = computed(() => records.value?.filter((r) => r.kind === 'loan') ?? []);
const borrowRecords = computed(() => records.value?.filter((r) => r.kind === 'debt') ?? []);

const isAddRecordDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
</script>

<template>
  <div class="flex flex-col gap-6">
    <Item>
      <ItemMedia>
        <Skeleton v-if="isLoading || !person" class="size-16 rounded-full" />
        <Avatar v-else class="size-16">
          <!-- <AvatarImage :src="person.avatar" class="grayscale" /> -->
          <AvatarFallback class="text-2xl">{{ person.name.charAt(0) }}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <template v-if="isLoading || !person">
          <Skeleton class="h-8 w-32 rounded-md" />
          <Skeleton class="h-5.25 w-48 rounded-md" />
        </template>
        <template v-else>
          <ItemTitle class="text-2xl">{{ person.name }}</ItemTitle>
          <ItemDescription>{{ person.description }}</ItemDescription>
        </template>
      </ItemContent>
      <ItemActions v-if="!isLoading && person" class="self-start" @click.stop>
        <PeopleActions @edit="isEditDialogOpen = true" @delete="isDeleteDialogOpen = true" />
      </ItemActions>
    </Item>

    <Separator />

    <template v-if="isRecordsLoading">
      <!-- Totals skeleton -->
      <div class="flex flex-wrap gap-4">
        <Card
          v-for="i in 3"
          :key="'total-' + i"
          class="min-w-44 grow-0 basis-44 gap-0 overflow-hidden border-b-4 py-0"
        >
          <CardHeader class="py-3">
            <Skeleton class="h-3 w-20 rounded-md" />
            <Skeleton class="h-5 w-24 rounded-md" />
          </CardHeader>
        </Card>
      </div>

      <!-- Records skeleton -->
      <div class="flex items-center justify-between">
        <Skeleton class="h-5 w-20 rounded-md" />
        <Skeleton class="h-8 w-28 rounded-md" />
      </div>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        <Card v-for="i in 4" :key="'record-' + i" class="gap-0 overflow-hidden border-l-4 py-0">
          <CardHeader class="py-4">
            <Skeleton class="h-5 w-24 rounded-md" />
            <Skeleton class="h-4 w-32 rounded-md" />
          </CardHeader>
        </Card>
      </div>
    </template>

    <RecordsEmpty v-else-if="records && records.length === 0" :personId />

    <template v-else>
      <!-- Totals -->
      <template v-if="totals.length > 0">
        <div class="flex flex-wrap gap-4">
          <RecordTotalCard
            v-for="(total, index) in totals"
            :key="index"
            :total
            class="min-w-44 grow-0 basis-44"
          />
        </div>
      </template>

      <!-- Records -->
      <div v-if="records && records.length > 0" class="flex items-center justify-between">
        <span class="text-sm font-medium text-muted-foreground">
          Records ({{ records.length }})
        </span>
        <Button size="sm" @click="isAddRecordDialogOpen = true">
          <Plus />
          Add Record
        </Button>
      </div>
      <template v-if="lendRecords.length > 0">
        <span class="text-xs text-green-500">Lend ({{ lendRecords.length }})</span>
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
          <RecordCard v-for="record in lendRecords" :key="record.id" :record :personId />
        </div>
      </template>

      <template v-if="borrowRecords.length > 0">
        <span class="text-xs text-red-500">Borrow ({{ borrowRecords.length }})</span>
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
          <RecordCard v-for="record in borrowRecords" :key="record.id" :record :personId />
        </div>
      </template>
    </template>

    <AddRecordDialog v-if="person" v-model:open="isAddRecordDialogOpen" :personId />
    <EditPersonDialog v-model:open="isEditDialogOpen" :person />
    <!-- TODO: It is possible to delete Person so far, but need to add more restrictions in the future -->
    <DeletePersonDialog v-model:open="isDeleteDialogOpen" :personId />
  </div>
</template>
