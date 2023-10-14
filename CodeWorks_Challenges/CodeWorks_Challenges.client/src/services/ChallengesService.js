import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from './AxiosService'
import { Challenge } from "../models/Challenge.js"
import Pop from "../utils/Pop.js"
import { Participant } from "../models/Participant.js"
import { Moderator } from "../models/Moderator.js"

class ChallengesService {

  async createChallenge(newChallenge) {
    const res = await api.post('/api/challenges', newChallenge)
    logger.log('Creating Challenge ⏩', res.data)
    AppState.activeChallenge = res.data
    return res.data
  }

  async getMyChallenges(accountId) {
    const res = await api.get(`/account/${accountId}/challenges`)
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
  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    logger.log(res.data)
    AppState.participants = res.data.map(p => new Participant(p))
    logger.log('Participants in this challenge:', AppState.participants)
  }
  async getModeratorsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/moderators`)
    logger.log('[MODERATOS]', res.data)
    AppState.moderators = res.data.map(p => new Moderator(p))
    logger.log('Moderators in this challenge:', AppState.moderators)
  }
}

export const challengesService = new ChallengesService()