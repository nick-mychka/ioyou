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

const { person, isPending = false } = defineProps<{
  person?: Person;
  isPending?: boolean;
}>();
</script>

<template>
  <Item>
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
        <Skeleton class="h-5.25 w-48 rounded-md" />
      </template>
      <template v-else>
        <ItemTitle>{{ person.name }}</ItemTitle>
        <ItemDescription>{{ person.description }}</ItemDescription>
      </template>
    </ItemContent>
    <ItemActions v-if="!isPending && person" class="gap-0">
      <PeopleActions />
    </ItemActions>
  </Item>
</template>
