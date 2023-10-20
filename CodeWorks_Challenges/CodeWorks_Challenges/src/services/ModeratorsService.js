import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

class ModeratorsService {

  async createModeration(moderatorData) {
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

  async getModerationsByChallengeCreatorId(userId) {
    // First, find the challenges with the given creator's userId.
    const challenges = await dbContext.Challenges.find({ creatorId: userId });

    // Then, get the moderators for these challenges.
    const moderators = await dbContext.Moderators.find({ challengeId: { $in: challenges } })
      .populate({
        path: 'challenge',
        populate: [
          { path: 'creator', select: '_id' },
          { path: 'participantCount' }
        ]
      })
      .populate('profile', 'name picture');

    return moderators;
  }

  async getModerationById(moderationId) {
    const moderation = await dbContext.Moderators.findById(moderationId)
    if (!moderation) {
      throw new BadRequest("Invalid Moderation ID.")
    }
    return moderation
  }

  async ApproveModeration(moderatorId, userId) {
    const moderation = await this.getModerationById(moderatorId)
    const challenge = await challengesService.getChallengeById(moderation.challengeId)


    if (moderation.originId == challenge.creatorId) {
      if (moderation.accountId != userId) {
        throw new Forbidden(
          `[PERMISSIONS ERROR]: Only the user can approve it.`
        )
      }
    } else if (moderation.originId == moderation.accountId) {
      if (challenge.creatorId != userId) {
        throw new Forbidden(
          `[PERMISSIONS ERROR]: Only the owner of ${challenge.name} can approve it.`
        )
      }
    }

    moderation.status = 'Active'

    await moderation.save()

    return moderation
  }

  async removeModeratoration(moderatorId, userId) {
    const moderatorToRemove = await dbContext.Moderators.findById(moderatorId)
    const challenge = await challengesService.getChallengeById(moderatorToRemove.challengeId)

    if (!moderatorToRemove) {
      throw new BadRequest("Invalid moderator ID.")
    }

    if (userId != moderatorToRemove.accountId && userId != challenge.creatorId) {
      throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this moderator's. You may not remove other moderator.")
    }

    moderatorToRemove.status = 'Terminated'
    await moderatorToRemove.save()

    return moderatorToRemove
  }
}

export const moderatorsService = new ModeratorsService()