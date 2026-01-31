import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useQueryClient } from '@tanstack/vue-query';

import { setBearerToken } from '@/api';

import { useAuthToken } from './useAuthToken';
import { useCurrentUser } from './useCurrentUser';

export function useAppBootstrap() {
  const token = useAuthToken();
  if (token.value) setBearerToken(token.value);

  const router = useRouter();

  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useCurrentUser();

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
