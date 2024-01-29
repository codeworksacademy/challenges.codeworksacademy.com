import { PROFILE_FIELDS } from "../constants/index.js"
import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

const EASY_CACHE = {}

class ChallengeModeratorsService {


  async createModeration(moderatorData) {
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

    return moderator;
  }

  async getMyModerations(accountId) {
    if (EASY_CACHE[accountId]) {
      return EASY_CACHE[accountId]
    }

    const moderators = await dbContext.ChallengeModerators.find({ $and: [{ $or: [{ status: 'active' }, { status: 'pending' }] }, { accountId: accountId }] }).populate({
      path: 'challenge',
      populate: { path: 'creator participantCount name description' }
    }).populate({ path: 'profile', populate: { path: 'name picture' } })
    EASY_CACHE[accountId] = moderators
    return moderators;
  }

  async getModeratorsByChallengeId(challengeId) {

    if (EASY_CACHE[challengeId]) {
      return Promise.resolve(EASY_CACHE[challengeId])
    }

    const moderators = await dbContext.ChallengeModerators.find({ $and: [{ $or: [{ status: 'active' }, { status: 'pending' }] }, { challengeId: challengeId }] }).populate('profile', PROFILE_FIELDS)
    EASY_CACHE[challengeId] = moderators;
    return moderators;
  }
  async getModeratorByUserIdAndChallengeId(userId, challengeId) {
    const mods = await this.getModeratorsByChallengeId(challengeId)

    // @ts-ignore
    const isMod = mods.find(m => m.accountId == userId)

    if (!isMod) {
      throw new Forbidden('This user is not a moderator for this challenge')
    }
    return isMod
  }

  async getMyModerationsByProfileId(profileId) {
    if (EASY_CACHE[profileId]) {
      return EASY_CACHE[profileId]
    }

    const moderators = await dbContext.ChallengeModerators.find({ accountId: profileId, status: 'active' }).populate({
      path: 'challenge',
      populate: { path: 'creator participantCount' }
    })
    EASY_CACHE[profileId] = moderators
    return moderators
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

  async getModerationById(moderationId) {
    const moderation = await dbContext.ChallengeModerators.findById(moderationId)
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

    moderation.status = 'active'

    await moderation.save()

    return moderation
  }

  async removeModerator(moderatorId, userId) {
    const moderatorToRemove = await dbContext.ChallengeModerators.findById(moderatorId)
    const challenge = await challengesService.getChallengeById(moderatorToRemove.challengeId)

    if (!moderatorToRemove) {
      throw new BadRequest("Invalid moderator ID.")
    }

    if (userId != moderatorToRemove.accountId && userId != challenge.creatorId) {
      throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this moderator's. You may not remove other moderators.")
    }

    moderatorToRemove.status = 'terminated'
    await moderatorToRemove.save()

    return moderatorToRemove
  }
}

export const challengeModeratorsService = new ChallengeModeratorsService()