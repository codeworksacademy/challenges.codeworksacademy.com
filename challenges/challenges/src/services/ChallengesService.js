import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";

class ChallengesService {

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)
    await challenge.populate('creator')
    return challenge
  }

  async getAllChallenges() {
    const challenges = await dbContext.Challenges.find().populate('creator')
    .sort({ createdAt: -1 })
    return challenges
  }

  async setActiveChallenge(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
    .populate('creator', 'name picture')
    if (!challenge) {
      throw new BadRequest("Invalid Challenge Id")
    }
    return challenge
  }

  async cancelChallenge(challengeId, userId) {
    const challenge = await this.setActiveChallenge(challengeId)
    if (challenge.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot cancel it.`
      )
    }
    challenge.isCancelled = !challenge.isCancelled
    await challenge.save()
    return challenge
  }

  async deleteChallenge(challengeId, userId) {
    const challenge = await this.setActiveChallenge(challengeId)
    if  (challenge.creatorId != userId)
      throw new Forbidden(
        `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot delete it.`
      )
    challenge.remove()
    return challenge
  }
}

export const challengesService = new ChallengesService()