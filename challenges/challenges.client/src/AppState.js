import { reactive } from 'vue'

// NOTE AppState is a reactive object to contain app level data
export const AppState = reactive({
  user: {},
  /** @type {import('./models/Account.js').Account} */
  account: {},
  /** @type {import('./models/Challenge.js').Challenge} */
  challenges: [],
  myChallenges: [],
  participants: [],
  /** @type {import('./models/Challenge.js')|null} */
  activeChallenge: null,
  /** @type {import('./models/Event.js').Event} */
  events: [],
  /** @type {import('./models/Event.js')|null} */
  activeEvent: null,
})
