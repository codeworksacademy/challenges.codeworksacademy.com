import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard, authSettled } from '@bcwdev/auth0provider-client'

export function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

export function loadChild(parent, child) {
  return () => import(`./pages/${parent}/${child}.vue`)
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
    beforeEnter: authGuard,
    // children: [
    //   {
    //     path: 'overview',
    //     name: 'AccountOverview',
    //     component: loadPage('AccountOverviewPage')
    //   },
    //   {
    //     path: 'activity',
    //     name: 'AccountActivity',
    //     component: loadPage('AccountActivityPage')
    //   },
    //   {
    //     path: 'badges',
    //     name: 'AccountBadges',
    //     component: loadPage('AccountBadgesPage')
    //   },
    //   {
    //     path: 'certificates',
    //     name: 'AccountCertificates',
    //     component: loadPage('AccountMilestonesPage')
    //   }
    // ]
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
    redirect: { name: 'Overview' },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('./pages/ChallengeDetailsPage/OverviewPage.vue'),
      },
      {
        path: 'requirements',
        name: 'Requirements',
        component: () => import('./pages/ChallengeDetailsPage/RequirementsPage.vue'),
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: () => import('./pages/ChallengeDetailsPage/StatisticsPage.vue'),
      }
    ]
  },
  {
    path: '/challenges/:challengeId/edit',
    name: 'ChallengeEditor',
    component: loadPage('ChallengeEditor'),
    // children: [
    //   {
    //     path: 'details',
    //     name: 'ChallengeEditor',
    //     component: loadPage('ChallengeEditor')
    //   },
    //   {
    //     path: 'moderation',
    //     name: 'ChallengeModeration',
    //     component: loadPage('ChallengeModerationPage')
    //   },
    //   {
    //     path: 'grading',
    //     name: 'GradeSubmissionsPage',
    //     component: loadPage('GradeSubmissionsPage')
    //   }
    // ]
  },
  {
    path: '/challenges/:challengeId/grade',
    name: 'GradeSubmissionsPage',
    component: loadPage('GradeSubmissionsPage')
  },
  {
    path: '/challenges/:challengeId/submissions',
    name: 'ChallengeSubmissionsPage',
    component: loadPage('ChallengeSubmissionsPage'),
    beforeEnter: authGuard
  },
  {
    path: '/challenges/:challengeId/moderators',
    name: 'ChallengeModeratorsPage',
    component: loadPage('ChallengeModeratorsPage'),
    beforeEnter: authGuard
  },
  {
    path: '/profiles/:profileId',
    name: 'Profile',
    component: loadPage('ProfilePage'),
  },
  {
    path: '/milestones',
    name: 'Milestones',
    component: loadPage('MilestonesPage'),
  },
  {
    path: '/markdown',
    name: 'Markdown',
    component: loadPage('MarkdownPage')
  },
  {
    path: '/refactor/:challengeId',
    name: 'Refactor',
    component: loadPage('ChallengeDetailsPageRefactor')
  }
  // {
  //   path: '/dev',
  //   name: 'dev',
  //   component: loadPage('OffCanvasPage'),
  // }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})