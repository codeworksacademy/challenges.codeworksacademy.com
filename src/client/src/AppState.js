import { RANK_VALUES } from "./constants"
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
  enableDifficultySorting: false
})