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

  async getChallengeById(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
    .populate('creator', 'name picture')
    if (!challenge) {
      throw new BadRequest("Invalid Challenge Id")
    }
    return challenge
  }

  async cancelChallenge(userId, challengeId) {
    const challenge = await this.getChallengeById(challengeId)
    const account = await accountService.getAccount(userId)
    if (challenge.creatorId !== userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: ${account.name}, you are not the creator of ${challenge.name}, therefore you cannot cancel it.`
      )
    }
  }
}

export const challengesService = new ChallengesService()