import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { container } from '@/services/container';

import { useAuthToken } from './useAuthToken';

export function useCurrentUser() {
  const authService = container.getAuthService();
  const token = useAuthToken();

  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me(),
    enabled: computed(() => !!token.value),
    retry: false,
  });
}
