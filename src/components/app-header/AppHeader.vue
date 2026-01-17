<script setup lang="ts">
import { LogOut } from 'lucide-vue-next';
import { useLocalStorage } from '@vueuse/core';

import { Button } from '@/components/ui/button';
import { AUTH_TOKEN_KEY } from '@/config/constants';

const token = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);

const handleLogout = () => {
  token.value = null;
};
</script>

<template>
  <header class="flex items-center justify-between border-b border-border px-6 py-4">
    <h1 class="text-xl font-bold">I<span class="text-primary">O</span>You</h1>

    <Button variant="ghost" size="sm" @click="handleLogout">
      <LogOut class="size-4" />
    </Button>
  </header>
</template>
