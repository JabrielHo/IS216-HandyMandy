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
      path: '/signin',
      name: 'signin',
      component: () => import('../views/SigninPage/SignIn.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/SigninPage/register.vue')
    },
    {
      path: '/requests',
      name: 'requests',
      component: () => import('../views/ServiceRequests/RequestView.vue')
    },
    {
      path: '/service-request',
      name: 'serviceRequest',
      component: () => import('../views/ServiceRequests/CreateRequestView.vue')
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/Services/Services.vue')
    },
    {
      path: '/personalProfile',
      name: 'personalprofile',
      component: () => import('../views/ProfilePage/personalProfile.vue')
    },
    {
      path: '/forum',
      name: 'forumpage',
      component: () => import('../views/Forum/forumpage.vue')
    },
    {
      path: '/request/:id',
      name: 'detailedRequest',
      component: () => import('../views/ServiceRequests/DetailedRequestView.vue')
    }
  ]
})

export default router
