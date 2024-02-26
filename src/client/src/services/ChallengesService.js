import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { api } from './AxiosService'
import { Challenge } from "../models/Challenge.js"
import { participantsService } from "./ParticipantsService.js"
import { challengeModeratorsService } from "./ChallengeModeratorsService.js"
import Pop from "../utils/Pop.js"
import { SUBMISSION_TYPES } from "../constants/index.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class ChallengesService {

  async createChallenge(newChallenge) {
    const res = await api.post('/api/challenges', newChallenge)
    logger.log('Creating Challenge ⏩', res.data)
    AppState.ChallengeState.challenge = new Challenge(res.data)
    return res.data
  }

  async setActiveChallenge(challengeId) {
    const res = await api.get(`/api/challenges/${challengeId}`)
    AppState.ChallengeState.challenge = new Challenge(res.data)
    participantsService.getParticipantsByChallengeId(challengeId)
    challengeModeratorsService.getModeratorsByChallengeId(challengeId)
    logger.log('Active Challenge:', AppState.ChallengeState.challenge)
  }

  async getChallengeData() {
    try {
      await Promise.all([
        this.getMyChallenges(),
        this.getAllChallenges()
      ])
    } catch (error) {
      // TODO - figure out repeat calls
      logger.error(error)
    }
  }

  async getMyChallenges() {
    const res = await api.get(`/account/challenges`)
    AppState.AccountState.challenges = res.data.map(c => new Challenge(c))
    logger.log('My Challenges:', AppState.AccountState.challenges)
  }

  async getAllChallenges() {
    if (AppState.challenges.length) { return }
    const res = await api.get('/api/challenges')
    AppState.challenges = res.data.map(c => new Challenge(c))
    logger.log('Challenges:', AppState.challenges)
  }

  async getProfileChallenges(profileId) {
    const res = await api.get(`api/profiles/${profileId}/challenges`)
    logger.log('[GETTING PROFILE CHALLENGES]', res.data)
    AppState.challenges = res.data.map(c => new Challenge(c))
  }

  // async deprecateChallenge(challengeId) {
  //   const res = await api.delete(`/api/challenges/${challengeId}`)
  //   logger.log('🚨🚨🚨deprecating Challenge ⏩', res.data)
  //   let i = AppState.challenges.findIndex(c => c.id == challengeId)
  //   AppState.challenges.splice(i, 1)
  // }

  // async deleteChallenge(challengeId) {
  //   const res = await api.delete(`/api/challenges/${challengeId}`)
  //   logger.log('🚨🚨🚨Deleting Challenge ⏩', res.data)
  //   let indexToDelete = AppState.challenges.findIndex(c => c.id == challengeId)
  //   AppState.challenges.splice(indexToDelete, 1)
  //   AppState.ChallengeState.challenge = res.data
  //   Pop.toast('You have successfully deleted this challenge!', 'success')
  // }

  async updateChallenge(challengeData, challengeId) {
    const res = await api.put(`/api/challenges/${challengeId}`, challengeData)
    logger.log('Updating Challenge ⏩', res.data)
    AppState.ChallengeState.challenge = new Challenge(res.data)
    return res.data
  }

  async submitChallenge(submission) {
    const res = await api.put(`api/challenges/${submission.challengeId}/submit`, submission);
    const challenger = AppState.ChallengeState.participants.find(p => p.accountId === AppState.user.id);
    challenger.status = res.data.status;
    return res.data.status;
  }


  async gradeParticipant(newGrade) {
    const res = await api.put(`api/challenges/${newGrade.challengeId}/participants/${newGrade.participantId}`, newGrade);
    const participantIndex = AppState.ChallengeState.participants.findIndex(p => p.participantId === newGrade.participantId);
    if (res.data.status == 'completed') {
      AppState.ChallengeState.challenge.completedCount++;
    }
    AppState.ChallengeState.participants.splice(participantIndex, 1, new ChallengeParticipant(res.data));
  }

  async giveReputation(challengeId, userId) {
    const res = await api.put(`api/challenges/${challengeId}/reputation`, userId);
    AppState.ChallengeState.challenge = new Challenge(res.data);
  }

  async getChallengesCreatedBy(id) {
    const res = await api.get(`api/profiles/${id}/challenges`)
    logger.log('[GETTING CHALLENGES CREATED BY USER]', res.data)
    AppState.challenges = res.data.map(c => new Challenge(c))
  }

  clearChallenge() {
    AppState.ChallengeState.challenge = null
    AppState.ChallengeState.moderator = null
    AppState.ChallengeState.participants = []
    AppState.ChallengeState.moderators = []
  }

  /* NOTE - Not sure if these search functions were being utilized, so i commented them out in case somewhere it;s still being used:

  async findChallenges(nameQuery) {
  const res = await api.get(`/api/challenges?name=${nameQuery}`)
  AppState.challenges = res.data.map(c => new Challenge(c))
  logger.log('Queried Challenges:', AppState.challenges)
}

async findChallengesByCategory(query) {
  const res = await api.get(`/api/challenges?category=${query}`)
  AppState.challenges = res.data.map(c => new Challenge(c))
  logger.log('Queried Challenges by category:', AppState.challenges)
}
*/
}

export const challengesService = new ChallengesService()