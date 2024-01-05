import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from './AxiosService'
import { Challenge } from "../models/Challenge.js"
import { participantsService } from "./ParticipantsService.js"
import { challengeModeratorsService } from "./ChallengeModeratorsService.js"
import Pop from "../utils/Pop.js"

class ChallengesService {

  async createChallenge(newChallenge) {
    const res = await api.post('/api/challenges', newChallenge)
    logger.log('Creating Challenge ⏩', res.data)
    AppState.activeChallenge = new Challenge(res.data)
    return res.data
  }

  async findChallenges(nameQuery) {
    const res = await api.get(`api/challenges/${nameQuery}/search`)
    logger.log('[FINDCHALLENGES]', res.data)
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Queried Challenges by name:', AppState.challenges)
  }

  async findChallengesByCategory(query) {
    const res = await api.get(`/api/challenges?category=${query}`)
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Queried Challenges by category:', AppState.challenges)
  }

  async getMyChallenges() {
    const res = await api.get(`/account/challenges`)
    AppState.myChallenges = res.data.map(c => new Challenge(c))
    logger.log('My Challenges:', AppState.myChallenges)
  }

  async getAllChallenges() {
    logger.log('Getting Challenges')
    const res = await api.get('/api/challenges')
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Challenges:', AppState.challenges)
  }

  async getProfileChallenges(profileId) {
    const res = await api.get(`api/profiles/${profileId}/challenges`)

    logger.log('[GETTING PROFILE CHALLENGES]', res.data)

    AppState.challenges = res.data.map(c => new Challenge(c))
  }

  async setActiveChallenge(challengeId) {
    const res = await api.get(`/api/challenges/${challengeId}`)
    AppState.activeChallenge = new Challenge(res.data)
    participantsService.getParticipantsByChallengeId(challengeId)
    challengeModeratorsService.getModeratorsByChallengeId(challengeId)
    logger.log('Active Challenge:', AppState.activeChallenge)
  }

  async filterDifficulty(difficulty) {
    await this.getAllChallenges()
    let challenges = AppState.challenges.filter(c => c.difficulty == difficulty)
    AppState.challenges = challenges
  }

  async deprecateChallenge(challengeId) {
    const res = await api.delete(`/api/challenges/${challengeId}`)
    logger.log('🚨🚨🚨deprecating Challenge ⏩', res.data)
    let i = AppState.challenges.findIndex(c => c.id == challengeId)
    AppState.challenges.splice(i, 1)
    Pop.toast('Your challenges has been marked as deprecated.', 'success')
  }

  async deleteChallenge(challengeId) {
    const res = await api.delete(`/api/challenges/${challengeId}`)
    logger.log('🚨🚨🚨Deleting Challenge ⏩', res.data)
    let indexToDelete = AppState.challenges.findIndex(c => c.id == challengeId)
    AppState.challenges.splice(indexToDelete, 1)
    AppState.activeChallenge = res.data
    Pop.toast('You have successfully deleted this challenge!', 'success')
  }

  async updateChallenge(challengeData, challengeId) {
    const res = await api.put(`/api/challenges/${challengeId}`, challengeData)
    logger.log('Updating Challenge ⏩', res.data)
    AppState.activeChallenge = new Challenge(res.data)
    return res.data
  }

  async giveReputation(challengeId) {
    const res = await api.put(`api/challenges/${challengeId}/reputation`)

    logger.log('[GIVING REPUTATION]', res.data)

    AppState.activeChallenge = new Challenge(res.data)

    return res.data
  }
}

export const challengesService = new ChallengesService()