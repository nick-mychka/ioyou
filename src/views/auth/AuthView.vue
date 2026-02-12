<script setup lang="ts">
import { ref } from 'vue';

import SigninForm from './components/SigninForm.vue';
import SignupForm from './components/SignupForm.vue';

const isLoginView = ref(true);
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <div class="flex flex-col gap-6">
      <SigninForm v-if="isLoginView" />
      <SignupForm v-else />
      <div class="text-center text-xs text-muted-foreground">
        {{ isLoginView ? "Don't have an account?" : 'Already have an account?' }}
        <span role="button" class="pl-1 text-primary" @click="isLoginView = !isLoginView">
          {{ isLoginView ? 'Sign Up' : 'Sign In' }}
        </span>
      </div>
    </div>
  </div>
</template>
