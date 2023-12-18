import { createRouter, createWebHashHistory } from 'vue-router'
import { authGuard, authSettled } from '@bcwdev/auth0provider-client'

export function loadPage(page) {
  return () => import(`./pages/${page}.vue`)
}

export function loadPageBranch(folder, file) {
  return () => import(`./pages/${folder}/${file}.vue`)
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
    children: [
      {
        path: 'overview',
        name: 'Account Overview',
        component: loadPage('AccountOverview')
      },
      {
        path: 'challenges',
        name: 'Account Challenges',
        component: loadPage('AccountChallenges')
      },
      {
        path: 'moderations',
        name: 'Account Moderations',
        component: loadPage('AccountModerations')
      },
      {
        path: 'badges',
        name: 'Account Badges',
        component: loadPage('AccountBadges')
      },
    ]
  },
  {
    path: '/challenges',
    name: 'Challenges',
    component: loadPage('ChallengePage'),
  },
  { 
    path: '/challenges/:challengeId',
    name: 'ChallengeDetails',
    component: loadPageBranch('ChallengeDetailsPage', 'ChallengeDetailsPage'),
    redirect: { name: 'Overview' },
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: loadPageBranch('ChallengeDetailsPage', 'OverviewPage'),
      },
      {
        path: 'requirements',
        name: 'Requirements',
        component: loadPageBranch('ChallengeDetailsPage', 'RequirementsPage'),
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: loadPageBranch('ChallengeDetailsPage', 'StatisticsPage'),
      }
    ]
  },
  {
    path: '/challenges/:challengeId/edit',
    name: 'ChallengeEditor',
    component: loadPage('ChallengeEditor')
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
    children: [
      {
        path: 'overview',
        name: 'Profile Overview',
        component: loadPage('ProfileOverview')
      },
      {
        path: 'challenges',
        name: 'Profile Challenges',
        component: loadPage('ProfileChallenges')
      },
      {
        path: 'badges',
        name: 'Profile Badges',
        component: loadPage('ProfileBadges')
      },
    ]
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
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})