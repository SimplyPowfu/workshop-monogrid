import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: () => import('@/views/Home.vue')}, 
    {path: '/three', component: () => import('@/views/ThreeJs.vue')}
  ],
})

export default router
