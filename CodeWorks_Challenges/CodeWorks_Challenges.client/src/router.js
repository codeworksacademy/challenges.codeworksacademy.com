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
        path: 'moderations',
        name: 'Account.moderations',
        component: loadPage('AccountModerations')
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
        component: loadPage('ChallengeBrowsePage')
      },
      {
        path: ':category',
        name: 'Challenges.challengeCategory',
        component: loadPage('ChallengeCategoryPage')
      },
      {
        path: ':difficulty',
        name: 'Challenges.challengeDifficulty',
        component: loadPage('ChallengeDifficultyPage')
      }
    ]
  },
  {
    path: '/challenges/:challengeId',
    name: 'Challenge',
    component: loadPage('ChallengePage'),
    redirect: { name: 'Challenge.overview' },
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
        path: 'edit',
        name: 'Challenge.challengeEditor',
        component: loadPage('ChallengeEditor')
      },
      {
        path: 'submissions',
        name: 'Challenge.challengeSubmissionsPage',
        component: loadPage('ChallengeSubmissionsPage')
        // beforeEnter: authguard
      },
      {
        path: 'moderators',
        name: 'Challenge.challengeModeratorsPage',
        component: loadPage('ChallengeModeratorsPage'),
        beforeEnter: authGuard
      },
      {
        path: 'grade',
        name: 'Challenge.gradeSubmissionsPage',
        component: loadPage('GradeSubmissionsPage'),
        beforeEnter: authGuard
      }
    ]
  },
  {
    path: '/profiles/:profileId',
    name: 'Profile',
    component: loadPage('ProfilePage'),
    children: [
      {
        path: '',
        name: 'Profile.overview',
        component: loadPage('ProfileOverview')
      },
      {
        path: 'challenges',
        name: 'Profile.challenges',
        component: loadPage('ProfileChallenges')
      },
      {
        path: 'badges',
        name: 'Profile.badges',
        component: loadPage('ProfileBadges')
      },
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
  {
    path: '/refactor/:challengeId',
    name: 'Refactor',
    component: loadPage('ChallengeDetailsPageRefactor')
  },
  {
    path: '/Error',
    name: 'Error',
    component: loadPage('ErrorPage'),
    meta: {
      error: { message: 'hello' }
    }
  }
]

export const router = createRouter({
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  history: createWebHashHistory(),
  routes
})