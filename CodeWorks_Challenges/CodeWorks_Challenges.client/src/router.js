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
    path: '/challenge/:challengeId',
    name: 'ChallengeDetails',
    component: loadPage('ChallengeDetailsPage'),
  },
  {
    path: '/challenge/:challengeId/edit',
    name: 'ChallengeEditPage',
    component: loadPage('ChallengeEditPage'),
    children: [
      {
        path: 'details',
        name: 'ChallengeEditor',
        component: loadPage('ChallengeEditor')
      },
      {
        path: 'moderation',
        name: 'ChallengeModeration',
        component: loadPage('ChallengeModerationPage')
      }
    ]
  },
  {
    path: '/participants/:participantId',
    name: 'ChallengeSubmissionsPage',
    component: loadPage('ChallengeSubmissionsPage'),
    beforeEnter: authGuard
  },
  {
    path: '/profile/:profileId',
    name: 'Profile',
    component: loadPage('ProfilePage'),
  },
  {
    path: '/milestones',
    name: 'Milestones',
    component: loadPage('MilestonesPage'),
  },
  // {
  //   path: '/routetestpage',
  //   name: 'RouteTestPage',
  //   component: loadPage('RouteTestPage'),
  //   children: [
  //     {
  //       path: 'edit',
  //       name: 'EditChallenge',
  //       component: loadPage('EditChallengePage'),
  //     },
  //     {
  //       path: 'edit2',
  //       name: 'Edit2',
  //       component: loadPage('AboutPage')
  //     }
  //   ]
  // }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})