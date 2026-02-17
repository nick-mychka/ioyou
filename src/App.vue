<script setup lang="ts">
import { RouterView } from 'vue-router';
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import 'vue-sonner/style.css';

import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <RouterView />
  <Toaster />
  <VueQueryDevtools />
</template>
