import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { Moderator } from "../models/Moderator.js"
class ModeratorsService {
  // TODO 
  // Create a moderator one to one moderator Id - challenge Id
  // Delete a moderator - as the moderator and as the challenge owner
  // Moderator must recieve approval 
  // From owner to user - by user
  // From user to owner - by owner

  async createModeration(moderatorData) {
    const res = await api.post('api/moderators', moderatorData)
    logger.log('[New moderation]:', res.data)
    // AppState.myModerations.push(new Moderator(res.data))
  }

  async getMyModerationsByUserId(userId) {
    const res = await api.get(`api/moderators/${userId}/profiles`)
    logger.log('[USERS MODERATIONS]', res.data)
    AppState.myModerations = res.data.map(m => new Moderator(m))
  }

  async getModerationsByChallengeCreatorId(userId) {
    const res = await api.get(`api/moderators/challenges/${userId}`)
    logger.log('[USERS RELATED MODERATIONS]', res.data)
    AppState.moderators = res.data.map(m => new Moderator(m))
  }
  async ApproveModeration(moderationId) {
    const res = await api.put(`api/moderators/${moderationId}`)
    logger.log('[Approved moderation]:', res.data)
    let moderatorToEdit = AppState.moderators.find(m => m.id == moderationId)
    moderatorToEdit.status = true
  }

  async removeModeration(moderationId) {
    const res = await api.delete(`api/moderators/${moderationId}`)
    logger.log('Deleted [moderation]:', res.data)
    // Remove moderation from challenge render
    let moderatorToRemove = AppState.moderators.findIndex(m => m.id == moderationId)
    if (moderatorToRemove != -1) {
      AppState.moderators.splice(moderatorToRemove, 1)
    }
    // Remove moderation from account data render
    let myModerationToRemove = AppState.myModerations.findIndex(m => m.id == moderationId)
    logger.log('[MY MOD REMOVAL]', moderationId, myModerationToRemove, AppState.myModerations)
    if (myModerationToRemove != -1) {
      AppState.myModerations.splice(myModerationToRemove, 1)
    }
  }
}

export const moderatorsService = new ModeratorsService()