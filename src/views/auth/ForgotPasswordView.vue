<script setup lang="ts">
import { computed, ref } from 'vue';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const email = ref('');

const isSubmitDisabled = computed(() => !email.value.trim());

const handleSubmit = () => {
  if (isSubmitDisabled.value) return;
  console.log('Recovery email:', email.value);
};
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <div class="flex flex-col gap-6">
      <div class="flex flex-col items-center justify-center gap-6">
        <h2 class="text-2xl font-bold">Forgot Password</h2>
        <form @submit.prevent="handleSubmit" class="flex w-80 flex-col gap-4">
          <Input placeholder="Email" v-model="email" />
          <Button type="submit" :disabled="isSubmitDisabled"> Recovery </Button>
        </form>
      </div>
      <div class="text-center text-xs text-muted-foreground">
        <RouterLink to="/login" class="text-primary"> Back to Sign In </RouterLink>
      </div>
    </div>
  </div>
</template>
