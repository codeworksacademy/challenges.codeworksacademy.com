import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

class ModeratorsService {
  async createModeration(moderatorData) {
    const challenge = await challengesService.getChallengeById(moderatorData.challengeId)
    // Check for origin 'owner', 'participant', 'admin'
    // Admin should just have own route?
    if (challenge.creatorId != moderatorData.accountId) {
      moderatorData.origin = 'participant'
    } else {
      moderatorData.origin = 'owner'
    }

    const moderation = await dbContext.Moderators.create(moderatorData)
    return moderation
  }

  async getModeratorsByChallengeId(challengeId) {
    // const moderators = await dbContext.Moderators.find({ challengeId: challengeId, status: true })
    const moderators = await dbContext.Moderators.find({ challengeId: challengeId }).populate({
      path: 'challenge',
      populate: { path: 'creator participantCount' }
    }).populate('profile', 'name picture')
    return moderators
  }

  async getMyModerationsByProfileId(profileId) {
    const moderators = await dbContext.Moderators.find({ accountId: profileId }).populate({
      path: 'challenge',
      populate: { path: 'creator participantCount' }
    }).populate('profile', 'name picture')
    return moderators
  }

  async removeModeratoration(moderatorId, userId) {
    const moderatorToRemove = await dbContext.Moderators.findById(moderatorId)

    if (!moderatorToRemove) {
      throw new BadRequest("Invalid moderator ID.")
    }

    if (userId != moderatorToRemove.accountId) {
      throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this moderator's. You may not remove other moderator.")
    }
    await moderatorToRemove.remove()

    return moderatorToRemove
  }

  async removeModerator(moderatorId, userId, challengeId) {
    const moderatorToRemove = await dbContext.Moderators.findById(moderatorId)
    const challenge = await challengesService.getChallengeById(challengeId)

    if (!moderatorToRemove) {
      throw new BadRequest("Invalid moderator ID.")
    }

    if (userId != challenge.creatorId) {
      throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this moderator's. You may not remove other moderator.")
    }
    await moderatorToRemove.remove()

    return moderatorToRemove
  }
}

export const moderatorsService = new ModeratorsService()