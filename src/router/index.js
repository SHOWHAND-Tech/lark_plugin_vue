import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../view/upload/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

console.log(router);

export default router