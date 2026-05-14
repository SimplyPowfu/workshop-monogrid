import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/pub',
      name: 'three',
      component: () => import('@/views/ThreeJs.vue'),
      children: [
        {
          path: ':id', 
          name: 'marker-detail',
          component: () => import('@/views/MarkerDetail.vue') 
        }
      ]
    },
    {
      path: '/custom',
      name: 'custom',
      component: () => import('@/views/Custom.vue')
    }
  ],
})

export default router
