import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard, authSettled } from '@bcwdev/auth0provider-client'

function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadPage('HomePage')
  },
  {
    path: '/about',
    name: 'About',
    component: loadPage('AboutPage')
  },
  {
    path: '/account',
    name: 'Account',
    component: loadPage('AccountPage'),
    beforeEnter: authGuard
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: loadPage('ChallengePage'),
  },
  {
    path: '/challenges/:challengeId',
    name: 'ChallengeDetails',
    component: loadPage('ChallengeDetailsPage'),
    children: [
      {
      path: 'edit',
      name: 'EditChallenge',
      component: loadPage('EditChallengePage'),
      beforeEnter: authGuard
      }
    ]
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})
