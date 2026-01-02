<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-vue-next';

const handleAddPerson = () => {
  console.log('Add Person');
};
</script>

<template>
  <main class="flex grow justify-center p-6">
    <div class="w-full max-w-7xl">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-2xl font-semibold">People records</h2>
        <Button @click="handleAddPerson">
          <Plus />
          Add Person
        </Button>
      </div>
    </div>
  </main>
</template>
