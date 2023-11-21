import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},
  /** @type {import('./models/Challenge.js').Challenge[]} */
  challenges: [],
  myChallenges: [],

  /** @type {import('./models/Participant.js').Participant[]} */
  participants: [],
  myParticipants: [],



  /** @type {import('./models/Reward.js').Reward[]} */
  rewards: [],
  myRewards: [],

  /** @type {import('./models/ChallengeModerator.js').ChallengeModerator[]} */
  moderators: [],
  myModerations: [],

  /** @type {import('./models/Submission.js').Submission[]} */
  submissions: [],
  mySubmissions: [],

  /** @type {import('./models/Challenge.js')|null} */
  activeChallenge: null,

  /** @type {import('./models/Participant.js')|null}*/
  activeParticipant: null,

  /** @type {import('./models/Profile.js')|null} */
  activeProfile: null,
  profiles: [],
  // query: '',

  /** @type {import('./models/AccountMilestone.js').Milestone[]} */
  myMilestone: [],

  milestones: [
    {
      description: "Test Description",
      check: "Test check",
      logic: "Test logic",
      ref: "Test ref"
    }
  ],
  milestoneChecks: [
    "createdChallenge", "joinedChallenge", "completedChallenge", "moderateChallenge"
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
