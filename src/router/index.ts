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
      path: '/services/:selectedservice',
      name: 'servicesDetail',
      component: () => import('../views/Services/Services.vue')
    },
    {
      path: '/create-service',
      name: 'createService',
      component: () => import('../views/Services/CreateService.vue')
    },
    // {
    //   path: '/personalProfile',
    //   name: 'personalProfile',
    //   component: () => import('../views/ProfilePage/personalProfile.vue')
    // },
    {
      path: '/profile/:userId',
      name: 'UserProfile',
      component: () => import('../views/ProfilePage/Profile.vue')
    },
    {
      path: '/plumbing',
      name: 'plumbing',
      component: () => import('../views/ProfilePage/plumbing.vue')
    },
    {
      path: '/phonefix',
      name: 'phonefix',
      component: () => import('../views/ProfilePage/phonefix.vue')
    },
    {
      path: '/paintmyroom',
      name: 'paintmyroom',
      component: () => import('../views/ProfilePage/paintmyroom.vue')
    },
    {
      path: '/furnitureassembly',
      name: 'furnitureassembly',
      component: () => import('../views/ProfilePage/Furniture_Assembly.vue')
    },
    {
      path: '/wifi_fixer',
      name: 'wifi_fixer',
      component: () => import('../views/ProfilePage/Wifi_fixer.vue')
    },
    {
      path: '/forum',
      name: 'forumpage',
      component: () => import('../views/Forum/forumpage.vue')
    },
    {
      path: '/forumpost',
      name: 'forumpost',
      component: () => import('../views/Forum/individualPost.vue')
    },
    {
      path: '/request/:id',
      name: 'detailedRequest',
      component: () => import('../views/ServiceRequests/DetailedRequestView.vue')
    },
    {
      path: '/post/:postId',
      name: 'individualPostView',
      component: () => import('../views/Forum/individualPost.vue'),
      props: true
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: () => import('../views/Inbox/ChatView.vue')
      // meta: { requiresAuth: true }
    },
    {
      path: '/inbox/:chatRoomId',
      name: 'chatView',
      component: () => import('../views/Inbox/ChatView.vue'),
      props: true
      // meta: { requiresAuth: true }
    },
    {
      path: '/photo-upload',
      name: 'photoUpload',
      component: () => import('../views/SigninPage/PhotoUpload.vue')
    },
    {
      path: '/createCertLicense/:userId',
      name: 'createCertificationLicenses',
      component: () => import('../views/ProfilePage/createCertLicense.vue'),
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // If there is a saved position, return it (for example, when using browser back/forward)
    if (savedPosition) {
      return savedPosition
    } else {
      // Otherwise, scroll to the top of the page
      return { top: 0 }
    }
  }
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
