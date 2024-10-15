import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('../views/ServiceRequests/RequestView.vue')
    },
    {
      path: '/service-request',
      name: 'serviceRequest',
      component: () => import("../views/ServiceRequests/CreateRequestView.vue")
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/Services.vue')
    }
  ]
})

export default router
