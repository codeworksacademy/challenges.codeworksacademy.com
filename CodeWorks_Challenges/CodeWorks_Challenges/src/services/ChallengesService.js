import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";

const PROFILE_FIELDS = 'name picture reputation title';

class ChallengesService {

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)
    await challenge.populate('creator', PROFILE_FIELDS)
    return challenge
  }

  async getAllChallenges() {

    const challenges = await dbContext.Challenges.find()
      .populate('creator', PROFILE_FIELDS)
      .select('-answers')
      .sort({ createdAt: -1 })
    return challenges
  }

  async getChallengeById(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
      .populate('creator', PROFILE_FIELDS)
      .select('-answers')

    if (!challenge) {
      throw new BadRequest('Invalid Challenge ID.')
    }

    return challenge
  }

  async getChallengesCreatedBy(profileId, accountId) {
    const challenges = accountId != profileId
      ? await dbContext.Challenges.find({ creatorId: profileId })
      : await dbContext.Challenges.find({ creatorId: profileId }).select('-answers')

    return challenges
  }

  async editChallenge(newChallenge, userId, challengeId) {
    const challenge = await this.getChallengeById(challengeId)
    // FIXME needs to allow for moderators
    if (challenge.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: Only the creator of ${challenge.name} can edit it.`
      )
    }

    // REVIEW SCHEMA CHANGES
    challenge.name = newChallenge.name || challenge.name
    challenge.description = newChallenge.description || challenge.description
    challenge.steps = newChallenge.steps || challenge.steps
    challenge.coverImg = newChallenge.coverImg || challenge.coverImg
    challenge.supportLinks = newChallenge.supportLinks || challenge.supportLinks
    challenge.answers = newChallenge.answers || challenge.answers
    challenge.difficulty = newChallenge.difficulty || challenge.difficulty

    await challenge.save()
    return challenge
  }

  async deprecateChallenge(challengeId, userId) {
    const challenge = await this.getChallengeById(challengeId)
    if (challenge.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot deprecate it.`
      )
    }
    challenge.status = 'deprecated'
    await challenge.save()
    return challenge
  }

  async deleteChallenge(challengeId, userId) {
    const challenge = await this.getChallengeById(challengeId)
    if (challenge.creatorId != userId)
      throw new Forbidden(
        `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot delete it.`
      )
    challenge.remove()
    return challenge
  }

  // FIXME what are we doing here with the answers??? incomplete
  // SUGGESTIONS: 
  //   - simplify to a single answer 
  //   - or validate all answers all correct order
  async submitAnswer(challengeId, userId, answer) {
    const challenge = await this.getChallengeById(challengeId)
    if (challenge.answers[0] === answer.answer) {
      // return 'You are correct!'
      return {
        correct: true
      }
    } else {
      // return `${answer.answer} is incorrect!`
      return {
        correct: false
      }
    }
    // return `${challenge.answers}, Answer: ${answer.answer}`;
  }
}

export const challengesService = new ChallengesService()