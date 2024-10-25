import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
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
      // meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/SigninPage/register.vue')
      // meta: { requiresAuth: false }
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
      // meta: { requiresAuth: true }
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
      // meta: { requiresAuth: true }
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
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('../views/Inbox/ChatView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (authStore.loading) {
    authStore.checkAuth()
  }
  if (to.matched.some((record) => record.meta.requiresAuth === true) && !authStore.user) {
    next('/signin')
  } else if (to.matched.some((record) => record.meta.requiresAuth === false) && authStore.user) {
    next('/')
  } else {
    next()
  }
})

export default router
