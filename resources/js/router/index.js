// Doc: https://router.vuejs.org/guide/
import { createRouter, createWebHistory } from 'vue-router';
// Also available: createWebHashHistory, createMemoryHistory

const routes = [
  // Doc: https://router.vuejs.org/api/interfaces/routelocation.html
  {
    path: '/',
    component: () => import('@/components/Main.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
