import { RANK_BADGE } from "./constants"
import { reactive } from 'vue'

// Fetch this data each time you land on a profile page
const ProfileState = reactive({
  loading: true,
  /**@type {import('./models/Profile.js').Profile} */
  profile: null,
  challenges: [],
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participations: [],
  /** @type {import('./models/AccountMilestone.js').Milestone[]} */
  milestones: [],
})

// Fetch this data one the user is logged-in
const AccountState = reactive({
  /** @type {import('./models/Account.js').Account} */
  account: {},
  challenges: [],
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participations: [],
  /** @type {import('./models/AccountMilestone.js').Milestone[]} */
  milestones: [],
})

// Fetch this data each time you land on a challenge page
const ChallengeState = reactive({
  /** @type {import('./models/Challenge.js')|null} */
  challenge: null,
  badgeTitleBackground: ["#FFF", "#D9D9D9", "#52CA96", "#F07B00", "#6E44C3", "#55CDFF", "#323358", "#0F141E"],
  badgeColorFill: ["#FF000090", "#FF7F0090", "#FFFF0090", "#00FF0090", "#0000FF90", "#4B008290", "#8F00FF90",],
  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participants: [],
  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
  moderators: [],
  /** @type {import('./models/ChallengeParticipant.js')|null}*/
  participant: null,
  /** @type {import('./models/ChallengeModerator.js')|null}*/
  moderator: null,
  /** @type {import('./models/Submission.js').Submission[]} */
  submissions: [],
})




// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  ProfileState,
  AccountState,
  ChallengeState,
  // challenges that show up in search and can be joined by the user
  /** @type {import('./models/Challenge.js').Challenge[]} */
  challenges: [],
  /**@type {import('./models/Profile.js').Profile} */
  profiles: [],


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


