import { reactive } from 'vue'
import { ChallengeParticipant } from './models/ChallengeParticipant.js'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},

  /** @type {import('./models/Profile.js').Profile[]} */
  profiles: [],

  /** @type {import('./models/Challenge.js').Challenge[]} */
  challenges: [],
  myChallenges: [],

  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participants: [],
  myParticipants: [],

  /** @type {import('./models/Reward.js').Reward[]} */
  rewards: [],
  myRewards: [],

  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
  moderators: [],
  moderations: [],

  /** @type {import('./models/Submission.js').Submission[]} */
  submissions: [],
  mySubmissions: [],

  /** @type {import('./models/Challenge.js')|null} */
  activeChallenge: null,

  /** @type {import('./models/ChallengeParticipant.js')|null}*/
  activeParticipant: null,

  /** @type {import('./models/ChallengeModerator.js')|null}*/
  activeModerator: null,

  /** @type {import('./models/Profile.js')|null} */
  activeProfile: null,
  // query: '',

  /** @type {import('./models/AccountMilestone.js').Milestone[]} */
  myMilestone: [],
  milestones: [],

  milestoneChecks: [
    "createdChallenge", "joinedChallenge", "completedChallenge", "moderateChallenge"
    , "submissionsChallenge"
    , "passingSubmissionsChallenge"
    // , "gradeModerators" This is to be called when a grading is performed
    , "submittedParticipant"
    , "passingParticipant"
    , "allMilestones"
  ],
  rankTitles: {
    0: "n00b",
    10: "geek",
    50: "debugger",
    100: "code monkey",
    150: "jarvis",
    300: "guru",
    500: "ninja",
    1000: "wizard"
  }

})
