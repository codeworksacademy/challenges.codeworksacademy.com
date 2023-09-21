import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from './AxiosService'
import { Challenge } from "../models/Challenge.js"
import Pop from "../utils/Pop.js"

class ChallengesService {

  async createChallenge(newChallenge) {
    logger.log('Creating Challenge')
    const res = await api.post('/api/challenges', newChallenge)
    logger.log('New Challenge:',  `${newChallenge}`)
    AppState.challenges.unshift(res.data)
    logger.log('New Challenge:', res.data)
  }

  async getAllChallenges() {
    logger.log('Getting Challenges')
    const res = await api.get('/api/challenges')
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Challenges:', AppState.challenges)
  }

  async cancelChallenge(challengeId) {
    const res = await api.delete(`/api/challenges/${challengeId}`)
    Pop.toast('Challenge Canceled', 'success')
    logger.log('Canceled Challenge:', res.data)
    return res.data
  }
}

export const challengesService = new ChallengesService()