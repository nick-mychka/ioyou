<script setup lang="ts">
import { Separator } from '@/components/ui/separator';

import PeopleSidebar from './components/people/PeopleSidebar.vue';
import PersonView from './components/person-view/PersonView.vue';
</script>

<template>
  <main class="grid grow grid-cols-[40%_1px_1fr] gap-6">
    <PeopleSidebar />
    <Separator orientation="vertical" class="self-stretch" />
    <PersonView />
  </main>
</template>
