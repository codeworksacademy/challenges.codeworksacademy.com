import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},
  /** @type {import('./models/Challenge.js').Challenge} */
  challenges: [],
  myChallenges: [],
  /** @type {import('./models/Challenge.js')|null} */
  // activeEvent: null,
  activeChallenge: null,
  /** @type {import('./models/Challenge.js').Event} */
  events: [],
  /** @type {import('./models/Challenge.js')|null} */
  activeEvent: null,
})
