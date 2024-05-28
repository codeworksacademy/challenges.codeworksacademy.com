import { PROFILE_FIELDS } from "../constants/index.js"
import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

class ChallengeModeratorsService {

  async getMyModerationsByProfileId(profileId) {
    const moderators = await dbContext.ChallengeModerators.find({ accountId: profileId, status: 'active' }).populate({
      path: 'challenge',
      populate: { path: 'creator participantCount' }
    })
    return moderators
  }

  // 🔽 REQUIRES AUTH 🔽
  async addModerator(moderatorData) {
    const { challengeId, accountId } = moderatorData;

    const existingModeration = await dbContext.ChallengeModerators.findOne({ challengeId, accountId });
    if (existingModeration) {
      if (existingModeration.status == 'active') {
        throw new BadRequest(`[MODERATION_STATUS::${existingModeration.status}] This user is already a moderator for this challenge.`);
      }
      return existingModeration;
    }

    const challenge = await challengesService.getChallengeById(challengeId);
    if (challenge.status == 'deprecated') {
      throw new BadRequest(`[CHALLENGE_STATUS::${challenge.status}] This challenge cannot be moderated at this time.`);
    }

    const moderator = await dbContext.ChallengeModerators.create(moderatorData);
    await moderator.populate('profile', PROFILE_FIELDS);
    return moderator;
  }

  async getModerationsByChallengeCreatorId(userId) {
    const challenges = await dbContext.Challenges.find({ creatorId: userId });
    const moderators = await dbContext.ChallengeModerators.find({ challengeId: { $in: challenges } })
      .populate({
        path: 'challenge',
        populate: { path: 'creator participantCount' }
      })
      .populate('profile', PROFILE_FIELDS);
    return moderators;
  }

  async removeModerator(moderatorId, userId) {
    const moderatorToRemove = await dbContext.ChallengeModerators.findById(moderatorId);
    const challenge = await challengesService.getChallengeById(moderatorToRemove.challengeId);

    if (!moderatorToRemove) {
      throw new BadRequest("Invalid moderator ID.");
    }

    if (userId != moderatorToRemove.accountId && userId != challenge.creatorId) {
      throw new Forbidden("[PERMISSIONS ERROR]: Your are not the challenge creator. You may not remove other moderators.");
    }

    const result = await moderatorToRemove.deleteOne();
    return 'Moderation removed - ' + JSON.stringify(result);
  }


  async getMyModerations(accountId) {
    const moderators = await dbContext.ChallengeModerators.find({ $and: [{ $or: [{ status: 'active' }, { status: 'pending' }] }, { accountId: accountId }] }).populate({
      path: 'challenge',
      populate: { path: 'creator participantCount name description' }
    }).populate({ path: 'profile', populate: { path: 'name picture' } })
    return moderators;
  }

  async getModeratorsByChallengeId(challengeId) {
    const moderators = await dbContext.ChallengeModerators.find({ $and: [{ $or: [{ status: 'active' }, { status: 'pending' }] }, { challengeId: challengeId }] }).populate('profile', PROFILE_FIELDS)
    return moderators;
  }

  async getModerator(userId, challengeId) {
    const mods = await this.getModeratorsByChallengeId(challengeId)
    const isMod = mods.find(m => m.accountId == userId)
    if (!isMod) {
      throw new Forbidden('This user is not a moderator for this challenge')
    }
    return isMod
  }

  async getModerationById(moderationId) {
    const moderation = await dbContext.ChallengeModerators.findById(moderationId)
    if (!moderation) {
      throw new BadRequest("Invalid Moderation ID.")
    }
    return moderation
  }

}

export const challengeModeratorsService = new ChallengeModeratorsService();