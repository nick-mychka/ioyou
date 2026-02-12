<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { Eye, EyeOff } from 'lucide-vue-next';
import { some } from 'es-toolkit/compat';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuthToken } from '@/composables/useAuthToken';
import { setBearerToken } from '@/api';
import { container } from '@/services/container';
import { SigninFormSchema, type SigninForm } from '@/types/auth';

const router = useRouter();
const token = useAuthToken();

const formData = ref<SigninForm>({
  email: '',
  password: '',
});
const showPassword = ref(false);
const formErrors = ref<{ email?: string; password?: string; general?: string }>({});

const queryClient = useQueryClient();
const authService = container.getAuthService();

const { mutate, isPending } = useMutation({
  mutationFn: (credentials: SigninForm) => authService.signin(credentials),
  onSuccess: async (data) => {
    setBearerToken(data.token);
    token.value = data.token;
    await queryClient.invalidateQueries({ queryKey: ['me'] });
    router.push({ name: 'home' });
  },
  onError: (error) => {
    formErrors.value = {
      general: error instanceof Error ? error.message : 'Sign in failed. Please try again.',
    };
  },
});

const isSubmitDisabled = computed(
  () => isPending.value || some(formData.value, (val) => !val.trim())
);

const handleSubmit = () => {
  // Clear previous errors
  formErrors.value = {};

  // Validate form data
  const result = SigninFormSchema.safeParse(formData.value);
  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors;
    formErrors.value = {
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    };
    return;
  }

  mutate(result.data);
};
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6">
    <h2 class="text-2xl font-bold">Sign In</h2>
    <form @submit.prevent="handleSubmit" class="flex w-80 flex-col gap-4">
      <div class="flex flex-col gap-1">
        <Input
          placeholder="Email"
          v-model="formData.email"
          :aria-invalid="formErrors.email ? 'true' : 'false'"
        />
        <p v-if="formErrors.email" class="text-xs text-destructive">{{ formErrors.email }}</p>
      </div>
      <div class="flex flex-col gap-1">
        <div class="relative">
          <Input
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            v-model="formData.password"
            :aria-invalid="formErrors.password ? 'true' : 'false'"
            class="pr-10"
          />
          <button
            type="button"
            class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <EyeOff v-if="showPassword" class="size-4" />
            <Eye v-else class="size-4" />
          </button>
        </div>
        <p v-if="formErrors.password" class="text-xs text-destructive">{{ formErrors.password }}</p>
      </div>
      <p v-if="formErrors.general" class="text-xs text-destructive">{{ formErrors.general }}</p>
      <Button type="submit" :disabled="isSubmitDisabled">
        <Spinner v-if="isPending" /> Sign In
      </Button>
    </form>
  </div>
</template>
