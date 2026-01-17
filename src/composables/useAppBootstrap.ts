import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { useLocalStorage } from '@vueuse/core';

import { setBearerToken } from '@/api';
import { container } from '@/services/container';
import { AUTH_TOKEN_KEY } from '@/config/constants';

export function useAppBootstrap() {
  const token = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  if (token.value) setBearerToken(token.value);

  const router = useRouter();

  const queryClient = useQueryClient();
  const authService = container.getAuthService();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me(),
    enabled: computed(() => !!token.value),
    retry: false,
  });

  // Handle auth errors - clear token (triggers redirect via token watcher)
  watch(error, (authError) => {
    if (authError) {
      token.value = null;
      toast.error(authError.message);
    }
  });

  // Handle logout/redirect
  watch(token, (newToken) => {
    if (!newToken) {
      queryClient.resetQueries({ queryKey: ['me'] });
      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' });
      }
    }
  });

  const isPending = computed(() => {
    if (!token.value) return false;
    return isLoading.value;
  });

  const isAuthenticated = computed(() => !!user.value);

  // Post-login navigation: redirect to home when auth succeeds on login page
  watch(isAuthenticated, (isAuth) => {
    if (isAuth && router.currentRoute.value.name === 'login') {
      router.push({ name: 'home' });
    }
  });

  return { isPending, isAuthenticated };
}
