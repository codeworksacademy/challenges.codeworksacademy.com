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
    
  async setActiveChallenge(challengeId) {
    const res = await api.get(`/api/challenges/${challengeId}`)
    AppState.activeChallenge = res.data
    logger.log('Active Challenge:', AppState.activeChallenge)
  }

  async cancelChallenge(challengeId) {
    const res = await api.delete(`/api/challenges/${challengeId}`)
    logger.log('Cancelling Challenge ⏩', res.data)
    let indexToCancel = AppState.challenges.findIndex(c => c.id == challengeId)
    AppState.challenges.splice(indexToCancel, 1)
    Pop.toast('You have cancelled your challenge.', 'success')
  }

  async deleteChallenge(challengeId) {
    const res = await api.delete(`/api/challenges/${challengeId}`)
    logger.log('Deleting Challenge ⏩', res.data)
    let foundChallenge = AppState.challenges.find(c => c.id == challengeId)
    AppState.challenges.splice(foundChallenge, 1)
    Pop.toast('You have successfully deleted this challenge!', 'success')
  }

  async updateChallenge(newChallenge, challengeId) {
    const res = await api.put(`/api/challenges/${challengeId}`, newChallenge)
    logger.log('Updating Challenge ⏩', res.data)
    AppState.activeChallenge = res.data
    return res.data
  }

  // async addStep(newStep) {
  //   const res = await api.post(`api/challenges${}`, newStep)
  //   AppState.activeChallenge.steps.push(res.data)
  //   logger.log('Step Added:', res.data)
  // }

  async updateSteps(newSteps, challengeId) {
    const res = await api.put(`/api/challenges/${challengeId}`, { newSteps })
    logger.log('Editing Steps ⏩', res.data)
    AppState.activeChallenge = res.data
    return res.data
  }
}

export const challengesService = new ChallengesService()