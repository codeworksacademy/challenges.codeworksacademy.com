import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard, authSettled } from '@bcwdev/auth0provider-client'

export function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: loadPage('HomePage')
  },
  {
    path: '/leaderboards',
    name: 'Leaderboards',
    component: loadPage('LeaderboardsPage')
  },
  {
    path: '/profiles/:profileId',
    name: 'Profile',
    component: loadPage('AccountPage'),
    children: [
      {
        path: '',
        name: 'Profile.overview',
        component: loadPage('AccountOverview')
      },
      {
        path: 'challenges',
        name: 'Profile.challenges',
        component: loadPage('AccountChallenges')
      },
      {
        path: 'badges',
        name: 'Profile.badges',
        component: loadPage('AccountBadges')
      },
    ]
  },
  {
    path: '/account',
    name: 'Account',
    component: loadPage('AccountPage'),
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: 'Account.overview',
        component: loadPage('AccountOverview')
      },
      {
        path: 'challenges',
        name: 'Account.challenges',
        component: loadPage('AccountChallenges')
      },
      {
        path: 'badges',
        name: 'Account.badges',
        component: loadPage('AccountBadges')
      },
      {
        path: 'milestones',
        name: 'Account.milestones',
        component: loadPage('AccountMilestones')
      },
      {
        path: 'moderations',
        name: 'Account.moderations',
        component: loadPage('AccountModerations')
      }
    ]
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: loadPage('ChallengesPage'),
    children: [
      {
        path: '',
        name: 'Challenges.browse',
        component: loadPage('ChallengesBrowsePage')
      },
      {
        path: ':difficulty',
        name: 'Challenges.browseDifficulty',
        component: loadPage('ChallengesBrowsePage')
      },
      {
        path: ':category/:difficulty',
        name: 'Challenges.challengeCategory',
        component: loadPage('ChallengesCategoryPage')
      }
    ]
  },
  {
    path: '/challenge/:challengeId',
    name: 'Challenge',
    component: loadPage('ChallengePage'),
    redirect: { name: 'Challenge.overview' },
    beforeEnter: authGuard,
    children: [
      {
        path: 'overview',
        name: 'Challenge.overview',
        component: loadPage('ChallengeOverviewPage')
      },
      {
        path: 'requirements',
        name: 'Challenge.requirements',
        component: loadPage('ChallengeRequirementsPage')
      },
      {
        path: 'statistics',
        name: 'Challenge.statistics',
        component: loadPage('ChallengeStatisticsPage')
      },
      {
        path: 'submissions',
        name: 'Challenge.challengeSubmissionsPage',
        component: loadPage('ChallengeSubmissionsPage'),
        // beforeEnter: authGuard
      },
      {
        path: 'grade',
        name: 'Challenge.gradeSubmissionsPage',
        component: loadPage('GradeSubmissionsPage'),
        beforeEnter: authGuard
      },
      {
        path: 'edit',
        name: 'Challenge.challengeEditor',
        component: loadPage('ChallengeEditor'),
        beforeEnter: authGuard
      },
      {
        path: 'moderators',
        name: 'Challenge.challengeModeratorsPage',
        component: loadPage('ChallengeModeratorsPage'),
        beforeEnter: authGuard
      }
    ]
  },
  {
    path: '/milestones',
    name: 'Milestones',
    component: loadPage('MilestonesPage')
  },
  {
    path: '/markdown',
    name: 'Markdown',
    component: loadPage('MarkdownPage')
  },
  // {
  //   path: '/refactor/:challengeId',
  //   name: 'Refactor',
  //   component: loadPage('ChallengeDetailsPageRefactor')
  // },
  {
    path: '/Error',
    name: 'Error',
    component: loadPage('ErrorPage'),
    meta: {
      error: { message: 'hello' }
    }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/Error',
    meta: {
      error: { message: '404 Not Found' }
    }
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})