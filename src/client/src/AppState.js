import { RANK_TITLE } from "./constants"
import { reactive } from 'vue'

// Fetch this data each time you land on a profile page
const ProfileState = reactive({
  /**@type {import('./models/Profile.js').Profile||null} */
  profile: null,
  /** @type {import('./models/Challenge.js').Challenge[]||null} */
  challenges: null,
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participation: [],
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
  moderation: [],
  /** @type {import('./models/AccountMilestone.js').Milestone[]} */
  milestones: [],
})

// Fetch this data one the user is logged-in
const AccountState = reactive({
  /** @type {import('./models/Account.js').Account} */
  account: {},
  /** @type {import('./models/Challenge.js').Challenge[]||null} */
  challenges: null,
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]||null} */
  participation: null,
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]||null} */
  moderation: null,
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]||null} */
  challengeModerations: null,
  /** @type {import('./models/AccountMilestone.js').Milestone[]||null} */
  milestones: null,
})

// Fetch this data each time you land on a challenge page
const ChallengeState = reactive({
  /** @type {import('./models/Challenge.js').Challenge||null} */
  challenge: null,
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant||null}*/
  participant: null,
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]||null} */
  participants: [],
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator||null}*/
  moderator: null,
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]||null} */
  moderators: [],
})

const MilestoneState = reactive({
  milestoneChecks: [
    "createdChallenge"
    , "joinedChallenge"
    , "moderateChallenge"
    , "submissionsChallenge"
    , "passingSubmissionsChallenge"
    // , "gradeModerators" This is to be called when a grading is performed
    , "submittedParticipant"
    , "passingParticipant"
    , "allMilestones"
  ],
  /** @type {import('./models/Milestone.js').Milestone[]} */
  milestones: []
})



// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  ProfileState,
  AccountState,
  ChallengeState,
  MilestoneState,
  // challenges that show up in search and can be joined by the user
  leaderboards: [],
  /** @type {import('./models/Challenge.js').Challenge[]} */
  challenges: [],
  /**@type {import('./models/Profile.js').Profile[]} */
  profiles: [],
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participants: [],
  enableDifficultySorting: false,

  rankTitles: {
    0: "Bugs Bunny",
    20: "Widget Weenie",
    200: "Code Cadet",
    400: "Function Fox",
    1000: "Bit Bender",
    1800: "Logic Lord",
    2800: "Malware Maven",
    4000: "Pixel Paladin",
    6000: "Code Conjurer",
    8250: "Matrix Master",
    10500: "Data Demigod",
    15000: "Centurion of Code"
  },
  rankBadges: {
    0: RANK_TITLE[0],
    20: RANK_TITLE[1],
    200: RANK_TITLE[2],
    400: RANK_TITLE[3],
    1000: RANK_TITLE[4],
    1800: RANK_TITLE[5],
    2800: RANK_TITLE[6],
    4000: RANK_TITLE[7],
    6000: RANK_TITLE[8],
    8250: RANK_TITLE[9],
    10500: RANK_TITLE[10],
    15000: RANK_TITLE[11]
  },
  rankThresholds: {
    0: RANK_TITLE[0].RANK_THRESHOLD,
    20: RANK_TITLE[1].RANK_THRESHOLD,
    200: RANK_TITLE[2].RANK_THRESHOLD,
    400: RANK_TITLE[3].RANK_THRESHOLD,
    1000: RANK_TITLE[4].RANK_THRESHOLD,
    1800: RANK_TITLE[5].RANK_THRESHOLD,
    2800: RANK_TITLE[6].RANK_THRESHOLD,
    4000: RANK_TITLE[7].RANK_THRESHOLD,
    6000: RANK_TITLE[8].RANK_THRESHOLD,
    8250: RANK_TITLE[9].RANK_THRESHOLD,
    10500: RANK_TITLE[10].RANK_THRESHOLD,
    15000: RANK_TITLE[11].RANK_THRESHOLD
  },
})