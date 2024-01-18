import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS } from '../constants';
import { challengeModeratorsService } from "./ChallengeModeratorsService.js";
import { participantsService } from "./ParticipantsService.js";
import { accountService } from "./AccountService.js";
import { accountMilestonesService } from "./AccountMilestonesService.js";
import { logger } from "../utils/Logger.js";


const EXPERIENCE_SCALE = {
	1: 10,
	2: 50,
	3: 250,
	4: 500,
	5: 1000
}

class ChallengesService {
  async gradeParticipant(challengeId, participantId, grade, userId) {
    const challenge = await this.getChallengeById(challengeId)
    const participant = await participantsService.getParticipantById(participantId)
    await challengeModeratorsService.getModeratorByUserIdAndChallengeId(userId, challengeId)

    if (userId == participantId) {
      throw new BadRequest('You cannot grade your own submission.')
    }

    participant.requirements = grade.requirements
    participant.grade = grade.requirements.reduce((acc, cur) => acc + cur.isCompleted ? 1 : 0, 0)
    if (grade.status != 'completed' || grade.status != 'returned for review') {
      throw new BadRequest('Invalid status.')
    }
    participant.status = grade.status

    try {
      accountMilestonesService.giveGradingMilestoneByAccountId(userId)
      if (participant.status == 'completed') {
        participant.completedAt = new Date()
        this.awardExperience(participant)
      }
    } catch (error) {
      // Address failure to award experience
      logger.error('[GRADING_HOOK_FAILED] for awarding experience', {error, participant, challenge})
    }

    await participant.save()
    return participant
  }

  // This method is used to give the experience of a challenge to a userId
  // Triggered by grading or autoGrade
  async awardExperience(participant) {

    let challenge = participant.challenge
    if (!challenge) {
      challenge = await this.getChallengeById(participant.challengeId)
    }
    
    await accountService.calculateAccountRank({ id: participant.accountId },  EXPERIENCE_SCALE[challenge.difficulty])
  }

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)
    dbContext.ChallengeModerators.create({
      accountId: newChallenge.creatorId,
      originIdId: newChallenge.creatorId,
      challengeId: challenge.id,
      status: 'active'
    })
    await challenge.populate('creator participantCount completedCount', PROFILE_FIELDS)
    return challenge
  }

  async getAllChallenges() {

    const challenges = await dbContext.Challenges.find({ status: 'published' })
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .select('-answer') //⚠️answer here.
      .sort({ createdAt: -1 })
    return challenges
  }

  async getChallengeById(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .select('-answer')
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
    const challenges = await dbContext.Challenges
      .find({ name: filter })
      .populate('creator participantCount completedCount', PROFILE_FIELDS)
      .collation({ locale: 'en_US', strength: 1 })
      .skip(Number(offset))
      .limit(20)
      .exec()
    return challenges
  }

  //This is where editing the challenge will have answers populated
  async getChallengesCreatedBy(profileId, accountId) {
    const challenges = accountId != profileId
      ? await dbContext.Challenges.find({ creatorId: profileId }).populate('creator participantCount completedCount', PROFILE_FIELDS)
      : await dbContext.Challenges.find({ creatorId: profileId }).select('-answers').populate('creator participantCount completedCount', PROFILE_FIELDS)

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
    challenge.badge = challengeData.badge || challenge.badge;
    challenge.answer = challengeData.answer || challenge.answer

    await challenge.save()
    return challenge
  }

  

  async giveReputation(challengeId, userId) {
    const challenge = await this.getChallengeById(challengeId)

    if (challenge.creatorId === userId) {
      throw new Forbidden('You cannot give reputation to your own challenge.')
    }

    const challengeCreator = await dbContext.Account.findById(challenge.creatorId)


    const index = challenge.reputationIds.findIndex(i => i === userId)
    if (index !== -1) {
      challenge.reputationIds.splice(index, 1)
      challengeCreator.reputation--
    } else {
      challenge.reputationIds = [...challenge.reputationIds, userId]
      challengeCreator.reputation++
    }


    await challengeCreator.save()
    await accountService.calculateAccountRank({ id: challengeCreator.id })

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


  async submitAnswer(challengeId, participantId, answer) {
    const participant = await participantsService.getParticipantById(participantId)
    const challenge = await dbContext.Challenges.findById(challengeId)
    if(challenge.autoGrade){
      if (challenge.answer === answer) {
        participant.status = 'completed';
        await participantsService.awardExperience(participant)
        await participant.save()
        return participant;
      } else if(challenge.answer != answer) {
        participant.status = 'incomplete';
        await participant.save()
        return participant
      }
    }
    if (!challenge.autoGrade) {
      participant.status = 'submitted';
      participant.submission = answer;
      await participant.save()
      return participant
    } 
  }
}

export const challengesService = new ChallengesService()