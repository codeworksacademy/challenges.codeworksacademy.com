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
    path: '/challenge/:challengeId/grading',
    name: 'GradeSubmissionsPage',
    component: loadPage('GradeSubmissionsPage')
  },
  {
    path: '/participants/:participantId',
    name: 'ChallengeSubmissionsPage',
    component: loadPage('ChallengeSubmissionsPage'),
    beforeEnter: authGuard
  },
  //Looking at the path between ChallengeSubmissionsPage and GradeSubmissionsPage, it could be assumed that each page has the following logic:
  // 1. ChallengeSubmissionsPage: Displays all submissions for a challenge. If the user is a participant, this page would also allow them to submit their own submission which means that the page would have to be able to handle both GET and POST requests. The use for this page is to display all submissions for a challenge, but also allow the user to submit their own submission. This is helpful for the user to see what other people have submitted and to also submit their own submission.
  // 2. GradeSubmissionsPage: Displays all submissions for a challenge, but with the ability to grade them. This page would have to be able to handle GET and PUT requests. The use for this page is to display all submissions for a challenge, but also allow the user to grade them.
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
  {
    path: '/markdown',
    name: 'Markdown',
    component: loadPage('MarkdownPage')
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