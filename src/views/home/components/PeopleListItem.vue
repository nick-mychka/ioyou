<script lang="ts" setup>
import { ref } from 'vue';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Person } from '@/types/person';

import PeopleActions from './PeopleActions.vue';
import { DeletePersonDialog } from './delete-person';
import { EditPersonDialog } from './edit-person';

const { person, isPending = false, isSelected = false } = defineProps<{
  person?: Person;
  isPending?: boolean;
  isSelected?: boolean;
}>();

const emit = defineEmits<{
  click: [];
  deleted: [];
}>();

const isEditDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
</script>

<template>
  <Item
    class="cursor-pointer transition-all"
    :class="{
      'ring-2 ring-primary shadow-lg shadow-primary/20 bg-primary/5': isSelected
    }"
    @click="emit('click')"
  >
    <ItemMedia>
      <Skeleton v-if="isPending || !person" class="h-8 w-8 rounded-full" />
      <Avatar v-else>
        <!-- <AvatarImage :src="person.avatar" class="grayscale" /> -->
        <AvatarFallback>{{ person.name.charAt(0) }}</AvatarFallback>
      </Avatar>
    </ItemMedia>
    <ItemContent>
      <template v-if="isPending || !person">
        <Skeleton class="h-5 w-24 rounded-md" />
        <Skeleton class="h-5 w-48 rounded-md" />
      </template>
      <template v-else>
        <ItemTitle>{{ person.name }}</ItemTitle>
        <ItemDescription>{{ person.description }}</ItemDescription>
      </template>
    </ItemContent>
    <ItemActions v-if="!isPending && person" class="gap-0" @click.stop>
      <PeopleActions
        :person-id="person.id"
        @edit="isEditDialogOpen = true"
        @delete="isDeleteDialogOpen = true"
      />
    </ItemActions>
  </Item>

  <EditPersonDialog v-if="person" v-model:open="isEditDialogOpen" :person-id="person.id" />
  <DeletePersonDialog
    v-if="person"
    v-model:open="isDeleteDialogOpen"
    :person-id="person.id"
    @deleted="emit('deleted')"
  />
</template>
