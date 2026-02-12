<script lang="ts" setup>
import { ref } from 'vue';

import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import { useStore } from '@/stores';
import type { Person } from '@/types/person';

import PeopleListItem from './PeopleListItem.vue';
import EditPersonDialog from '../edit-person/EditPersonDialog.vue';
import DeletePersonDialog from '../delete-person/DeletePersonDialog.vue';

const { data, isPending } = defineProps<{
  data: Person[] | undefined;
  isPending: boolean;
}>();

const skeletonLimit = 2;

const dialogPersonId = ref<string | null>(null);
const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);

const { selectedPersonId, togglePersonId } = useStore();

const openEditDialog = (personId: string) => {
  dialogPersonId.value = personId;
  isEditDialogOpen.value = true;
};

const openDeleteDialog = (personId: string) => {
  dialogPersonId.value = personId;
  isDeleteDialogOpen.value = true;
};
</script>

<template>
  <div class="flex w-full flex-col gap-6 px-2">
    <ItemGroup>
      <template v-if="isPending">
        <template v-for="index in skeletonLimit" :key="index">
          <PeopleListItem isPending />
          <ItemSeparator v-if="index < skeletonLimit" />
        </template>
      </template>
      <template v-else>
        <template v-for="(person, index) in data" :key="person.id">
          <PeopleListItem
            :person="person"
            :isSelected="selectedPersonId === person.id"
            @click="togglePersonId(person.id)"
            @edit="openEditDialog"
            @delete="openDeleteDialog"
          />
          <ItemSeparator v-if="data && index !== data.length - 1" />
        </template>
      </template>
    </ItemGroup>
  </div>

  <EditPersonDialog
    v-model:open="isEditDialogOpen"
    :person="data?.find((person) => person.id === dialogPersonId)"
  />
  <!-- TODO: It is possible to delete Person so far, but need to add more restrictions in the future -->
  <DeletePersonDialog v-model:open="isDeleteDialogOpen" :personId="dialogPersonId" />
</template>
