<script lang="ts" setup>
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

const {
  person,
  isLoading = false,
  isSelected = false,
} = defineProps<{
  person?: Person;
  isLoading?: boolean;
  isSelected?: boolean;
}>();

defineEmits<{
  edit: [personId: string];
  delete: [personId: string];
}>();
</script>

<template>
  <Item
    class="cursor-pointer transition-all"
    :class="{
      'bg-primary/5 shadow-lg ring-2 shadow-primary/20 ring-primary': isSelected,
    }"
  >
    <ItemMedia>
      <Skeleton v-if="isLoading || !person" class="size-8 rounded-full" />
      <Avatar v-else class="size-8">
        <!-- <AvatarImage :src="person.avatar" class="grayscale" /> -->
        <AvatarFallback>{{ person.name.charAt(0) }}</AvatarFallback>
      </Avatar>
    </ItemMedia>
    <ItemContent>
      <template v-if="isLoading || !person">
        <Skeleton class="h-5 w-24 rounded-md" />
        <Skeleton class="h-5.25 w-48 rounded-md" />
      </template>
      <template v-else>
        <ItemTitle>{{ person.name }}</ItemTitle>
        <ItemDescription>{{ person.description }}</ItemDescription>
      </template>
    </ItemContent>
    <ItemActions v-if="!isLoading && person" class="gap-0" @click.stop>
      <PeopleActions @edit="$emit('edit', person.id)" @delete="$emit('delete', person.id)" />
    </ItemActions>
  </Item>
</template>
