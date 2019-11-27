import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import { authGuard } from '../auth/authGuard'
import ExternalApiView from '../views/ExternalApi'
import UsersView from '../views/Users'
import RolesView from '../views/Roles'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    beforeEnter: authGuard
  },
  {
    path: '/external-api',
    name: 'external-api',
    component: ExternalApiView,
    beforeEnter: authGuard
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView,
    beforeEnter: authGuard
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
