<script lang="ts" setup>
import { useStore } from '@/stores';

import PersonUnselected from './PersonUnselected.vue';
import PersonDetails from './PersonDetails.vue';

const store = useStore();
</script>

<template>
  <section class="flex flex-col pr-6 pb-6 pt-3 pl-2 overflow-y-auto">
    <PersonUnselected v-if="!store.selectedPersonId" />
    <PersonDetails v-else :key="store.selectedPersonId" :personId="store.selectedPersonId" />
  </section>
</template>
