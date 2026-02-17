<script lang="ts" setup>
import AppHeader from '@/components/app-header/AppHeader.vue';

import { useAppBootstrap } from '@/composables/useAppBootstrap';

const { isAuthenticated } = useAppBootstrap();
</script>

<template>
  <div v-if="isAuthenticated" class="flex h-full flex-col">
    <AppHeader />
    <RouterView />
  </div>
  <div v-else class="flex h-full items-center justify-center">
    <Spinner class="size-10" />
  </div>
</template>
