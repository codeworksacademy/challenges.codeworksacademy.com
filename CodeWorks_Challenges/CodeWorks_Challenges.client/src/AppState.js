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

  // "completedChallenge"
  milestoneChecks: [
    "createdChallenge",
    "joinedChallenge", "moderateChallenge"
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
    5: RANK_BADGE[1],
    15: RANK_BADGE[2],
    30: RANK_BADGE[3],
    50: RANK_BADGE[4],
    70: RANK_BADGE[5],
    100: RANK_BADGE[6],
    150: RANK_BADGE[7],
    220: RANK_BADGE[8],
    310: RANK_BADGE[9],
    400: RANK_BADGE[10],
    500: RANK_BADGE[11]
  },
  rankThresholds: {
    0: RANK_BADGE[0].RANK_THRESHOLD,
    5: RANK_BADGE[1].RANK_THRESHOLD,
    15: RANK_BADGE[2].RANK_THRESHOLD,
    30: RANK_BADGE[3].RANK_THRESHOLD,
    50: RANK_BADGE[4].RANK_THRESHOLD,
    70: RANK_BADGE[5].RANK_THRESHOLD,
    100: RANK_BADGE[6].RANK_THRESHOLD,
    150: RANK_BADGE[7].RANK_THRESHOLD,
    220: RANK_BADGE[8].RANK_THRESHOLD,
    310: RANK_BADGE[9].RANK_THRESHOLD,
    400: RANK_BADGE[10].RANK_THRESHOLD,
    500: RANK_BADGE[11].RANK_THRESHOLD
  },
})