<script lang="ts" setup>
import { computed } from 'vue';

import { Skeleton } from '@/components/ui/skeleton';
import { usePeople } from '@/composables/usePeople';

import PeopleList from './PeopleList.vue';
import PeopleEmpty from './PeopleEmpty.vue';
import AddPersonButton from '../add-person/AddPersonButton.vue';

const { data, isPending, isSuccess, error } = usePeople();

const peoplePresent = computed(() => {
  return isSuccess.value && data.value && data.value.length > 0;
});
</script>

<template>
  <section class="flex flex-col">
    <template v-if="isPending || peoplePresent">
      <header class="flex items-center justify-between px-6 py-8">
        <template v-if="isPending">
          <Skeleton class="h-8 w-19" />
          <Skeleton class="h-9 w-31" />
        </template>
        <template v-else>
          <h2 class="text-2xl font-semibold">People</h2>
          <AddPersonButton />
        </template>
      </header>
      <PeopleList :data="data" :isPending="isPending" />
    </template>
    <!-- TODO: Design error state -->
    <p v-else-if="error">{{ error.message }}</p>
    <PeopleEmpty v-else />
  </section>
</template>
