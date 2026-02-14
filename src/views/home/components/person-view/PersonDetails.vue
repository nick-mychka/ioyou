<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

import PeopleActions from '../people/PeopleActions.vue';
import AddRecordDialog from '../add-record/AddRecordDialog.vue';
import EditPersonDialog from '../edit-person/EditPersonDialog.vue';
import DeletePersonDialog from '../delete-person/DeletePersonDialog.vue';

const { personId } = defineProps<{
  personId: string;
}>();

const { data: person, isLoading } = usePerson(personId);
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
      <ItemActions v-if="!isLoading && person" class="gap-0 self-start" @click.stop>
        <PeopleActions @edit="isEditDialogOpen = true" @delete="isDeleteDialogOpen = true" />
      </ItemActions>
    </Item>

    <Separator />

    <Item>
      <ItemContent>
        <ItemTitle class="text-xl font-normal">Records</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Button @click="isAddRecordDialogOpen = true" class="w-full">
          <Plus />
          Add Record
        </Button>
      </ItemActions>
    </Item>

    <AddRecordDialog v-if="person" v-model:open="isAddRecordDialogOpen" :personId />
    <EditPersonDialog v-model:open="isEditDialogOpen" :person />
    <!-- TODO: It is possible to delete Person so far, but need to add more restrictions in the future -->
    <DeletePersonDialog v-model:open="isDeleteDialogOpen" :personId />
  </div>
</template>
