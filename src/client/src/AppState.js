import { RANK_BADGE } from "./constants"
import { reactive } from 'vue'

// Fetch this data each time you land on a profile page
const ProfileState = reactive({
  loading: true,
  /**@type {import('./models/Profile.js').Profile} */
  profile: null,
  challenges: [],
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
  challenges: [],
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participation: [],
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
  moderation: [],
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
  challengeModeration: [],
  /** @type {import('./models/AccountMilestone.js').Milestone[]} */
  milestones: [],
})

// Fetch this data each time you land on a challenge page
const ChallengeState = reactive({
  loading: true,
  /** @type {import('./models/Challenge.js')|null} */
  challenge: null,
  /** @type {import('./models/ChallengeParticipant.js')|null}*/
  participant: null,
  /** @type {import('./models/ChallengeModerator.js')|null}*/
  moderator: null,
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participants: [],
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
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


  rankTitles: {
    0: "Bugs Bunny",
    5: "Widget Weenie",
    10: "Code Cadet",
    15: "Function Fox",
    30: "Bit Bender",
    50: "Logic Lord",
    70: "Malware Maven",
    100: "Pixel Paladin",
    150: "Code Conjurer",
    310: "Matrix Master",
    400: "Data Demigod",
    500: "Centurion of Code"
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