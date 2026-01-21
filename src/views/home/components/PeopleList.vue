<script lang="ts" setup>
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import type { Person } from '@/types/person';

import PeopleListItem from './PeopleListItem.vue';

const { data, isPending } = defineProps<{
  data: Person[] | undefined;
  isPending: boolean;
}>();

const skeletonLimit = 2;
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
          <PeopleListItem :person="person" />
          <ItemSeparator v-if="data && index !== data.length - 1" />
        </template>
      </template>
    </ItemGroup>
  </div>
</template>
