import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /** Route requires authentication */
    requiresAuth?: boolean;
    /** Route is only accessible to guests (non-authenticated users) */
    guestOnly?: boolean;
  }
}
