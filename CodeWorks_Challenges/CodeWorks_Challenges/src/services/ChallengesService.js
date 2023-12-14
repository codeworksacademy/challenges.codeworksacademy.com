import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS } from '../constants';


class ChallengesService {

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)
    await challenge.populate('creator participantCount completedCount', PROFILE_FIELDS)
    return challenge
  }

  async getAllChallenges() {

    const challenges = await dbContext.Challenges.find()
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .select('-answer')
      .sort({ createdAt: -1 })
    return challenges
  }

  async getChallengeById(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .select('-answers')
    if (!challenge) {
      throw new BadRequest('Invalid Challenge ID.')
    }

    return challenge
  }

  /**
  * @param {string} name
   */
  async findChallenges(name = '', offset = 0) {
    const filter = new RegExp(name, 'ig')
    return await dbContext.Challenges
      .aggregate([{
        $match: { name: filter }
      }])
      .collation({ locale: 'en_US', strength: 1 })
      .skip(Number(offset))
      .limit(20)
      .exec()
  }

  //This is where editing the challenge will have answers populated
  async getChallengesCreatedBy(profileId, accountId) {
    const challenges = accountId != profileId
      ? await dbContext.Challenges.find({ creatorId: profileId }).populate('creator', PROFILE_FIELDS)
      : await dbContext.Challenges.find({ creatorId: profileId }).select('-answers').populate('creator', PROFILE_FIELDS)

    return challenges
  }

  async setActiveChallenge(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
      .populate('creator', 'name picture')
    if (!challenge) {
      throw new BadRequest("Invalid Challenge ID.")
    }
    return challenge
  }

  async editChallenge(newChallenge, userId, challengeId) {
    const challenge = await this.getChallengeById(challengeId)
    // todo [🚧 Kyle]  needs to allow for moderators
    if (challenge.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: Only the creator of ${challenge.name} can edit it.`
      )
    }

    // REVIEW [🚧 Chantha] Verify if this updates all the correct fields
    challenge.name = newChallenge.name || challenge.name
    challenge.description = newChallenge.description || challenge.description
    challenge.category = newChallenge.category || challenge.category
    challenge.requirements = newChallenge.requirements || challenge.requirements
    challenge.coverImg = newChallenge.coverImg || challenge.coverImg
    challenge.supportLinks = newChallenge.supportLinks || challenge.supportLinks
    challenge.answer = newChallenge.answer || challenge.answer
    challenge.difficulty = newChallenge.difficulty || challenge.difficulty
    challenge.status = newChallenge.status || challenge.status

    await challenge.save()
    return challenge
  }

  async giveReputation(challengeId, userId) {
    const challenge = await this.getChallengeById(challengeId)

    const foundUserId = challenge.reputationIds.find(i => i === userId)

    if (foundUserId) {
      throw new Forbidden('You have already given reputation to this challenge. You cannot give reputation twice.')
    }

    challenge.reputationIds = [...challenge.reputationIds, userId]

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

  // TODO [🚧 Chantha] consolidate challenge submission
  // NOTE be sure to award points based on difficulty
  async submitAnswer(challengeId, userId, answer) {
    const challenge = await dbContext.Challenges.findById(challengeId)

    if (challenge.answer === answer.answerData) {
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
    // return challenge;
    // return `${challenge.answer}, Answer: ${answer.answerData}`;
  }
}

export const challengesService = new ChallengesService()