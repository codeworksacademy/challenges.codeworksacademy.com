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
    "createdChallenge",
    "joinedChallenge", "moderateChallenge"
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
    10: "Widget Weenie",
    30: "Code Cadet",
    60: "Function Fox",
    100: "Bit Bender",
    150: "Logic Lord",
    210: "Malware Maven",
    280: "Pixel Paladin",
    360: "Code Conjurer",
    450: "Matrix Master",
    550: "Data Demigod",
    660: "Centurion of Code"
  },
  rankBadges: {
    0: RANK_TITLE[0],
    10: RANK_TITLE[1],
    30: RANK_TITLE[2],
    60: RANK_TITLE[3],
    100: RANK_TITLE[4],
    150: RANK_TITLE[5],
    210: RANK_TITLE[6],
    280: RANK_TITLE[7],
    360: RANK_TITLE[8],
    450: RANK_TITLE[9],
    550: RANK_TITLE[10],
    660: RANK_TITLE[11]
  },
  rankThresholds: {
    0: RANK_TITLE[0].RANK_THRESHOLD,
    10: RANK_TITLE[1].RANK_THRESHOLD,
    30: RANK_TITLE[2].RANK_THRESHOLD,
    60: RANK_TITLE[3].RANK_THRESHOLD,
    100: RANK_TITLE[4].RANK_THRESHOLD,
    150: RANK_TITLE[5].RANK_THRESHOLD,
    210: RANK_TITLE[6].RANK_THRESHOLD,
    280: RANK_TITLE[7].RANK_THRESHOLD,
    360: RANK_TITLE[8].RANK_THRESHOLD,
    450: RANK_TITLE[9].RANK_THRESHOLD,
    550: RANK_TITLE[10].RANK_THRESHOLD,
    660: RANK_TITLE[11].RANK_THRESHOLD
  },
})