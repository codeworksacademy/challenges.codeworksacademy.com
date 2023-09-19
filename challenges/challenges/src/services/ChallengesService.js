import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";

class ChallengesService {

  async createChallenge(challengeData) {
    const challenge = await dbContext.Challenges.create(challengeData)
    await challenge.populate('creator')
    return challenge
  }

  async getAllChallenges() {
    const challenges = await dbContext.Challenges.find().populate('creator')
    .sort({ startDate: 1 })
    return challenges
  }
}

export const challengesService = new ChallengesService()