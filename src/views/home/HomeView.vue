<script setup lang="ts">
import AddPersonButton from './components/add-person/AddPersonButton.vue';
import PeopleCards from './components/PeopleCards.vue';
</script>

<template>
  <main class="flex grow flex-col p-6">
    <div class="w-full">
      <header class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-semibold">People records</h2>
        <AddPersonButton />
      </header>
      <section>
        <PeopleCards />
      </section>
    </div>
  </main>
</template>
