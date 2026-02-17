<script lang="ts" setup>
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next';

import { Button } from '@/components/ui/button';

import AddPersonDialog from './AddPersonDialog.vue';

const isDialogOpen = ref(false);
</script>

<template>
  <Button @click="isDialogOpen = true">
    <Plus />
    Add Person
  </Button>

  <AddPersonDialog v-model:open="isDialogOpen" />
</template>
