import { useLocalStorage } from '@vueuse/core';

import { AUTH_TOKEN_KEY } from '@/config/constants';

export function useAuthToken() {
  return useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
}
