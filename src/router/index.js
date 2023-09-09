import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/OneDimension.vue'),
  },
  {
    path: '/2d',
    component: () => import('../views/TwoDimension.vue'),
  },
]

const router = createRouter({
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
})

export default router
