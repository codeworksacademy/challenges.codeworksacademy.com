import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},
  /** @type {import('./models/Challenge.js').Challenge[]} */
  challenges: [],
  myChallenges: [],

  /** @type {import('./models/ChallengeParticipant.js').ChallengeParticipant[]} */
  participants: [],
  myParticipants: [],



  /** @type {import('./models/Reward.js').Reward[]} */
  rewards: [],
  myRewards: [],

  /** @type {import('./models/Moderator.js').Moderator[]} */
  moderators: [],
  myModerations: [],

  /** @type {import('./models/Submission.js').Submission[]} */
  submissions: [],
  mySubmissions: [],

  /** @type {import('./models/Challenge.js')|null} */
  activeChallenge: null,

  /** @type {import('./models/ChallengeParticipant.js')|null}*/
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
  ]

})
