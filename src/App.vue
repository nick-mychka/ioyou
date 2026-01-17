<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import 'vue-sonner/style.css';

import { Toaster } from '@/components/ui/sonner';
import { Spinner } from '@/components/ui/spinner';
import { AppHeader } from '@/components/app-header';
import { useAppBootstrap } from '@/composables/useAppBootstrap';

const { isPending, isAuthenticated } = useAppBootstrap();
</script>

<template>
  <div class="flex h-full flex-col">
    <div v-if="isPending" class="flex h-full items-center justify-center">
      <Spinner class="size-10" />
    </div>
    <template v-else>
      <AppHeader v-if="isAuthenticated" />
      <RouterView />
    </template>
  </div>
  <Toaster />
  <VueQueryDevtools />
</template>
