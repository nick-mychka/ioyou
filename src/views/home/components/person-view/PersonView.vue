<script lang="ts" setup>
import { useStore } from '@/stores';

import PersonUnselected from './PersonUnselected.vue';
import PersonDetails from './PersonDetails.vue';

const store = useStore();
</script>

<template>
  <section class="flex flex-col overflow-y-auto pt-3 pr-6 pb-6 pl-2">
    <PersonUnselected v-if="!store.selectedPersonId" />
    <PersonDetails v-else :key="store.selectedPersonId" :personId="store.selectedPersonId" />
  </section>
</template>
