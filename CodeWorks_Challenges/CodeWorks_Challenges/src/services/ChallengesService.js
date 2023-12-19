import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS } from '../constants';
import { challengeModeratorsService } from "./ChallengeModeratorsService.js";


class ChallengesService {

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)
    await challenge.populate('creator participantCount completedCount', PROFILE_FIELDS)
    return challenge
  }

  async getAllChallenges() {

    const challenges = await dbContext.Challenges.find()
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .select('-answer') //⚠️answer here.
      .sort({ createdAt: -1 })
    return challenges
  }

  async getChallengeById(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .select('-answer')//⚠️ but answers here? Corrected to answer after reviewing Schema
    if (!challenge) {
      throw new BadRequest('Invalid Challenge ID.')
    }

    return challenge
  }

  /**
  * @param {string} name
   */

  async findChallengesByQuery(name = '', offset = 0) {
    const filter = new RegExp(name, 'ig')
    return await dbContext.Challenges
      .aggregate([
        {
          $match: { name: filter }
        }, {
          $lookup: { //.populate() does not work here, this doesn't work yet
            from: 'Account',
            localField: 'creatorId',
            foreignField: '_id',
            as: 'creator'
          }
        }
      ])
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

  async editChallenge(challengeData, userId, challengeId) {
    const challenge = await this.getChallengeById(challengeId)

    const isChallengeModerator = await challengeModeratorsService.getModeratorByUserIdAndChallengeId(userId, challengeId)

    if (!isChallengeModerator && challenge.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: Only the creator of ${challenge.name} or a moderator can edit it.`
      )
    }

    challenge.category = challengeData.category || challenge.category
    challenge.status = challengeData.status || challenge.status
    challenge.name = challengeData.name || challenge.name
    challenge.description = challengeData.description || challenge.description
    challenge.requirements = challengeData.requirements || challenge.requirements
    challenge.supportLinks = challengeData.supportLinks || challenge.supportLinks
    challenge.autoGrade = challengeData.autoGrade || challenge.autoGrade
    challenge.difficulty = challengeData.difficulty || challenge.difficulty
    challenge.coverImg = challengeData.coverImg || challenge.coverImg
    challenge.badgeImg = challengeData.badgeImg || challenge.badgeImg
    challenge.answer = challengeData.answer || challenge.answer

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

  // 🚨This cannot be accessed from client
  // async deprecateChallenge(challengeId, userId) { 
  //   const challenge = await this.getChallengeById(challengeId)
  //   if (challenge.creatorId != userId) {
  //     throw new Forbidden(
  //       `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot deprecate it.`
  //     )
  //   }
  //   challenge.status = 'deprecated'
  //   await challenge.save()
  //   return challenge
  // }

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
  // Is this submitting an answer as a user and setting as an authorized?
  // 🚨 I don't understand, Is the submit answer values not supposed to be on the participant? If so, This 'correct' value is not being saved anywhere on a challenge => user relationship
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