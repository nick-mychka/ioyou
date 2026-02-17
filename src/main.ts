import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryCache, QueryClient, VueQueryPlugin } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';
import { HttpRequestError } from './repositories';
import { AUTH_TOKEN_KEY } from './config/constants';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
// Configure Vue Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 401
        if (error instanceof HttpRequestError && error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // Handle global query errors - if 401, clear token to trigger logout
      if (error instanceof HttpRequestError && error.status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    },
  }),
});
app.use(VueQueryPlugin, { queryClient });

app.mount('#app');
