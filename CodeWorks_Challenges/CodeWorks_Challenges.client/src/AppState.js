import { RANK_BADGE } from "./constants"
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
    0: "Bugs Bunny",
    10: "Widget Weenie",
    50: "Code Cadet",
    100: "Function Fox",
    150: "Bit Bender",
    300: "Logic Lord",
    500: "Malware Maven",
    1000: "Pixel Paladin",
    5000: "Code Conjurer",
    10000: "Matrix Master",
    15000: "Data Demigod",
    20000: "Centurion of Code"
  },
  rankBadges: {
    0: RANK_BADGE[0],
    10: RANK_BADGE[1],
    50: RANK_BADGE[2],
    100: RANK_BADGE[3],
    150: RANK_BADGE[4],
    300: RANK_BADGE[5],
    500: RANK_BADGE[6],
    1000: RANK_BADGE[7],
    5000: RANK_BADGE[8],
    10000: RANK_BADGE[9],
    15000: RANK_BADGE[10],
    20000: RANK_BADGE[11]
  },
})