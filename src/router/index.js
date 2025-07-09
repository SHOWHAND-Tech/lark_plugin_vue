import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/hr-plugin',
    name: 'hr-plugin',
    component: () => import('../view/hr/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router