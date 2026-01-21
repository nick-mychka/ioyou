<script setup lang="ts">
import { computed, ref } from 'vue';

import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { usePeople } from '@/composables/usePeople';

import AddPersonButton from './components/add-person/AddPersonButton.vue';
import PeopleList from './components/PeopleList.vue';
import PeopleEmpty from './components/PeopleEmpty.vue';
import PersonUnselected from './components/PersonUnselected.vue';

const { data, isPending, isSuccess, error } = usePeople();
const selectedPersonId = ref<number | null>(null);

const peoplePresent = computed(() => {
  return isSuccess.value && data.value && data.value.length > 0;
});
</script>

<template>
  <main class="flex grow flex-col">
    <div class="grid grow grid-cols-[40%_1px_1fr] gap-6">
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
          <PeopleList :data="data" :isPending="isPending" :error="error" />
        </template>
        <PeopleEmpty v-else />
      </section>
      <Separator orientation="vertical" class="self-stretch" />
      <section class="flex flex-col px-6 py-8">
        <PersonUnselected v-if="peoplePresent && !selectedPersonId" />
      </section>
    </div>
  </main>
</template>
