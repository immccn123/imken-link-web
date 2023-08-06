// Composables
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        /*
         * Route level code-splitting
         * this generates a separate chunk (about.[hash].js) for this route
         * which is lazy-loaded when the route is visited.
         */
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
      },
      {
        path: '/admin',
        name: 'Admin',
        component: () => import('@/views/Admin.vue'),
      },
      {
        path: '/links/:pageId(\\d+)?',
        name: 'Links',
        component: () => import('@/views/Links.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
