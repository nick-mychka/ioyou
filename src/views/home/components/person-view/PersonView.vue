<script lang="ts" setup>
import { useStore } from '@/stores';

import PersonUnselected from './PersonUnselected.vue';
import PersonDetails from './PersonDetails.vue';

const store = useStore();
</script>

<template>
  <section class="flex flex-col px-6 py-8">
    <PersonUnselected v-if="!store.selectedPersonId" />
    <PersonDetails v-else :key="store.selectedPersonId" :personId="store.selectedPersonId" />
  </section>
</template>
