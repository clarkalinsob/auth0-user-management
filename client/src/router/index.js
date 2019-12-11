import Vue from 'vue'
import VueRouter from 'vue-router'

// Import Views
import Home from '../views/Home'
import Profile from '../views/Profile'
import ExternalApiView from '../views/ExternalApi'
import UsersView from '../views/Users'
import RolesView from '../views/Roles'

// Import Components
import EmptyRouterView from '../components/EmptyRouterView'

import { authGuard } from '../auth/authGuard'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/external-api',
    name: 'external-api',
    component: ExternalApiView,
    beforeEnter: authGuard
  },
  {
    path: '/users',
    component: EmptyRouterView,
    beforeEnter: authGuard,
    children: [
      {
        name: 'users',
        path: '',
        component: UsersView
      },
      {
        name: 'profile',
        path: ':id',
        component: Profile
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    component: RolesView,
    beforeEnter: authGuard
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
