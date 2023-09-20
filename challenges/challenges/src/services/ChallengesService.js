import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";

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
}

export const challengesService = new ChallengesService()