import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard } from '@bcwdev/auth0provider-client'

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
    path: '/events',
    name: 'Events',
    component: loadPage('EventPage')
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: loadPage('ChallengePage'),
  },
  {
    path: '/news',
    name: 'News',
    component: loadPage('NewsPage'),
  },
  // ANCHOR - The below route is usable once we create a Profile model. Be sure to remove the comment in Navbar.vue on this endpoints router-link!
  // {
  //   path: '/profile/:id',
  //   name: 'Profile',
  //   component: loadPage('ProfilePage'),
  // },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: loadPage('LeaderboardPage'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: loadPage('SettingsPage'),
    beforeEnter: authGuard
  },
  {
    path: '/dev',
    name: 'Dev',
    component: loadPage('DevPage')
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})
