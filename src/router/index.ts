import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/home/HomeView.vue';
import ProtectedLayout from '@/layouts/ProtectedLayout.vue';
import { AUTH_TOKEN_KEY } from '@/config/constants';

import './types';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/AuthView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/recovery',
      name: 'recovery',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/',
      component: ProtectedLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
      ],
    },
    // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
});

router.beforeEach((to) => {
  const authToken = localStorage.getItem(AUTH_TOKEN_KEY);

  if (to.meta.requiresAuth && !authToken) {
    return { name: 'login' };
  }

  if (to.meta.guestOnly && authToken) {
    return { name: 'home' };
  }
});

export default router;
