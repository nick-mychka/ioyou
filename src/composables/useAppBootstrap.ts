import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useQueryClient } from '@tanstack/vue-query';

import { setBearerToken, deleteBearerToken } from '@/api';

import { useAuthToken } from './useAuthToken';
import { useCurrentUser } from './useCurrentUser';

export function useAppBootstrap() {
  const token = useAuthToken();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (token.value) {
    setBearerToken(token.value);
  }

  const { data: user, error } = useCurrentUser();

  watch(error, (authError) => {
    if (authError) {
      token.value = null;
      toast.error(authError.message);
    }
  });

  // Handle logout - clear query cache and redirect to login
  watch(token, (newToken) => {
    if (!newToken) {
      queryClient.clear();
      deleteBearerToken();
      router.push({ name: 'login' });
    }
  });

  return {
    isAuthenticated: computed(() => !!user.value),
  };
}
