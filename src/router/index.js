
import Vue from 'vue'
import Router from 'vue-router'
import Signin from '../components/Signin.vue'
import Registration from '../components/Registration.vue'
import Dashboard from '../components/Dashboard.vue'
// import UserDetail from '../components/UserDetails.vue'
// import CreateUser from '../components/CreateUser.vue'
import LandingPage from '../components/LandingPage.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/register',
      name: 'registration',
      component: Registration,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    // {
    //   path: '/manageUser',
    //   name: 'UserDetail',
    //   component: UserDetail,
    //   meta: { requiresAuth: true }
    // },
    // {
    //   path: '/createUser',
    //   name: 'createUser',
    //   component: CreateUser,
    //   meta: { requiresAuth: true }
    // }
  ]
})

router.beforeEach((to, from, next) => {
  const isSignedIn = localStorage.signedIn

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isSignedIn) {
      next({ name: 'LandingPage' })
    } else {
      next()
    }
  } else if (to.name === 'Signin' || to.name === 'LandingPage') {
    if (isSignedIn) {
      next({ name: 'Dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
