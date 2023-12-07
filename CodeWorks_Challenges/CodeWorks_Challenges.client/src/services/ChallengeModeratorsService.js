import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { ChallengeModerator } from "../models/ChallengeModerator"
class ChallengeModeratorsService {

  async createModeration(moderatorData) {
    const res = await api.post('api/moderators', moderatorData)
    logger.log('[New moderation]:', res.data)
    AppState.moderators.push(new ChallengeModerator(res.data))
  }

  async createOwnedChallengeModeration(moderatorData) {
    const res = await api.post('api/moderators/account', moderatorData)
    logger.log('[New moderation]:', res.data)
    AppState.moderators.push(new ChallengeModerator(res.data))
  }

  async getMyModerationsByUserId(userId) {
    const res = await api.get(`api/moderators/${userId}/profiles`)
    logger.log('[MODERATIONS BY USERID]', res.data)
    AppState.myModerations = res.data.map(m => new ChallengeModerator(m))
  }


  async getModeratorsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/moderators`)
    AppState.moderators = res.data.map(m => new ChallengeModerator(m))
    logger.log('[Moderators in this challenge]:', AppState.moderators)
  }

  async getModerationsByChallengeCreatorId(userId) {
    const res = await api.get(`api/moderators/challenges/${userId}`)
    logger.log('[MODERATIONS BY CHALLENGEID]', res.data)
    AppState.moderators = res.data.map(m => new ChallengeModerator(m))
  }

  async approveModeration(moderationId) {
    const res = await api.put(`api/moderators/${moderationId}`)
    logger.log('[Approved moderation]:', res.data)
    let moderatorToEdit = AppState.moderators.find(m => m.id == res.data.id)
    if (moderatorToEdit)
      moderatorToEdit.status = true
    let myModeratorToEdit = AppState.myModerations.find(m => m.id == res.data.id)
    if (myModeratorToEdit)
      myModeratorToEdit.status = true
  }

  async removeModeration(moderationId) {
    const res = await api.delete(`api/moderators/${moderationId}`)
    logger.log('Deleted [moderation]:', res.data)
    // Remove moderation from challenge render
    let moderatorToRemove = AppState.moderators.findIndex(m => m.id == moderationId)
    if (moderatorToRemove != -1) {
      AppState.moderators.splice(moderatorToRemove, 1)
    }    // Remove moderation from account data render
    let myModerationToRemove = AppState.myModerations.findIndex(m => m.id == moderationId)
    // logger.log('[MY MOD REMOVAL]', moderationId, myModerationToRemove, AppState.myModerations)
    if (myModerationToRemove != -1) {
      AppState.myModerations.splice(myModerationToRemove, 1)
    }
  }

  async gradeChallenge(newGrade) {

    // you should never have to pass an accountId as a Route Param
    const res = await api.put(`api/challenges/${newGrade.challengeId}/grade`, newGrade)
    logger.log('[Challenge graded]:', res.data)
    
    // This should be unnecessary since we edited the object already
    // let participantToGrade = AppState.participants.find(p => p.id == res.data.id)
    // if (participantToGrade)
    //   participantToGrade.grade = res.data.grade
  }
}

export const challengeModeratorsService = new ChallengeModeratorsService()