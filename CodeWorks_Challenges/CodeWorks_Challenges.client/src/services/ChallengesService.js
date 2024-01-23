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
    AppState.ChallengeState.challenge = new Challenge(res.data)
    return res.data
  }

  async findChallenges(nameQuery) {
    const res = await api.get(`/api/challenges?name=${nameQuery}`)
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Queried Challenges:', AppState.challenges)
    //If it says cannot create property 'name' on string '' it's because the query is empty. That's because it's not a string, it's an object.
  }

  async findChallengesByCategory(query) {
    const res = await api.get(`/api/challenges?category=${query}`)
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Queried Challenges by category:', AppState.challenges)
  }

  async getMyChallenges() {
    const res = await api.get(`/account/challenges`)
    AppState.AccountState.challenges = res.data.map(c => new Challenge(c))
    logger.log('My Challenges:', AppState.AccountState.challenges)
  }

  async getAllChallenges() {
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
    AppState.ChallengeState.challenge = new Challenge(res.data)
    participantsService.getParticipantsByChallengeId(challengeId)
    challengeModeratorsService.getModeratorsByChallengeId(challengeId)
    logger.log('Active Challenge:', AppState.ChallengeState.challenge)
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
    AppState.ChallengeState.challenge = res.data
    Pop.toast('You have successfully deleted this challenge!', 'success')
  }

  async updateChallenge(challengeData, challengeId) {
    const res = await api.put(`/api/challenges/${challengeId}`, challengeData)
    logger.log('Updating Challenge ⏩', res.data)
    AppState.ChallengeState.challenge = new Challenge(res.data)
    return res.data
  }

  async submitChallenge(challengeId, participantId, participant){

    logger.log(`[CHALLENGE ID]: ${challengeId} [PARTICIPANT ID]: ${participantId} [SUBMISSION]: ${participant.submission} [STATUS]: ${participant.status}`)
    const res = await api.put(`api/challenges/${challengeId}/submit`, {
      challengeId: challengeId,
      participantId: participantId,
      submission: participant.submission,
      status: participant.status
    })
    logger.log('Submitting Answer ⏩', res.data)
    
    AppState.ChallengeState.participant = res.data.participant
    // AppState.ChallengeState.challenge = res.data.challenge
    return res.data
  }


  async gradeChallengeParticipant(newGrade) {
    const res = await api.put(`api/moderators/${newGrade.participantId}/grade`, newGrade)
    logger.log('Participant Updated ⏩', res.data)
    AppState.ChallengeState.participant = res.data
    return res.data
  }

  async giveReputation(challengeId, userId) {
    logger.log('Challenge ID:', challengeId, 'User ID:', { userId })
    const res = await api.put(`api/challenges/${challengeId}/reputation`, userId)
    logger.log('Giving Reputation ⏩', res.data)
    AppState.ChallengeState.challenge = res.data
    return res.data
  }

  async getChallengesCreatedBy(id) {
    const res = await api.get(`api/profiles/${id}/challenges`)
    logger.log('[GETTING CHALLENGES CREATED BY USER]', res.data)
    AppState.challenges = res.data.map(c => new Challenge(c))
  }
}

export const challengesService = new ChallengesService()