import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS, SUBMISSION_TYPES } from '../constants';
import { challengeModeratorsService } from "./ChallengeModeratorsService.js";
import { participantsService } from "./ParticipantsService.js";
import { accountService } from "./AccountService.js";
import { accountMilestonesService } from "./AccountMilestonesService.js";
import { logger } from "../utils/Logger.js";
import { profilesService } from "./ProfilesService.js";

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
    //@ts-ignore
    if (userId == participant.profile.id) {
      throw new BadRequest('You cannot grade your own submission.')
    }
    participant.requirements = grade.requirements.map(req => {
      return {
        description: req
      }
    })
    participant.grade = grade.requirements.reduce((completedReq, newGrade) => {
      if (newGrade.status == 'completed') {
        completedReq++
      }
      return completedReq
    }, 0)
    grade.status = participant.status
    try {
      accountMilestonesService.giveGradingMilestoneByAccountId(userId)
      if (grade.status == 'completed') {
        participant.completedAt = new Date()
        this.awardExperience(participant)
      }
    } catch (error) {
      //@ts-ignore
      logger.log(`${participant.profile.name} ⚠️ [STATUS]: '${grade.status}' for ${challenge.name}. No rewards were given.`, error)
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

    await accountService.calculateAccountRank({ id: participant.accountId }, EXPERIENCE_SCALE[challenge.difficulty])
  }

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)

    await challengeModeratorsService.createModeration({
      challengeId: challenge.id,
      accountId: challenge.creatorId,
      status: 'active',
      originId: challenge.creatorId
    })

    return challenge
  }

  async getAllChallenges() {

    const challenges = await dbContext.Challenges.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .select('-answer')
      .populate('creator', PROFILE_FIELDS)
      .populate('participantCount')
      .populate('completedCount')
    return challenges
  }

  async getChallengeById(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
      .select('-answer')
      .populate('creator', PROFILE_FIELDS)
      .populate('participantCount')
      .populate('completedCount')
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
      .select('-answer')
      .populate('creator', PROFILE_FIELDS)
      .populate('participantCount')
      .populate('completedCount')
      .collation({ locale: 'en_US', strength: 1 })
      .skip(Number(offset))
      .limit(20)
      .exec()
    return challenges
  }

  //This is where editing the challenge will have answers populated
  async getChallengesCreatedBy(profileId, accountId) {
    const challenges = accountId != profileId
      ? await dbContext.Challenges.find({ creatorId: profileId }).select('-answer')
        .populate('creator', PROFILE_FIELDS)
        .populate('participantCount')
        .populate('completedCount')

      : await dbContext.Challenges.find({ creatorId: profileId })
        .populate('creator', PROFILE_FIELDS)
        .populate('participantCount')
        .populate('completedCount')

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
    challenge.creatorCoverImg = challengeData.creatorCoverImg || challenge.creatorCoverImg
    challenge.badge = challengeData.badge || challenge.badge;
    challenge.answer = challengeData.answer || challenge.answer

    await challenge.save()
    return challenge
  }

  async giveReputation(challengeId, userId) {
    const challenge = await this.getChallengeById(challengeId)
    // @ts-ignore
    const challengeCreator = challenge.creator
    await dbContext.Account.findById(challengeCreator.id)
    const index = challenge.reputationIds.findIndex(i => i === userId)
    if (index === -1) {
      challenge.reputationIds.push(userId)
      challengeCreator.reputation++
    } else {
      challenge.reputationIds.splice(index, 1)
      challengeCreator.reputation--
    }
    await dbContext.Account.findByIdAndUpdate(challengeCreator.id, { reputation: challengeCreator.reputation })
    await challenge.save()
    await challengeCreator.save()
    return challenge
  }

  async submitChallenge(challengeId, participantId, submission) {
    const challenge = await dbContext.Challenges.findById(challengeId)
    const participant = await participantsService.getParticipantById(participantId)
    if (challenge.autoGrade) {
      if (challenge.answer == submission) {
        participant.status = SUBMISSION_TYPES.COMPLETED;
        // participant.status = 'completed'
        // await this.awardExperience(participant)
        await participant.save()
        return participant
      } else if (challenge.answer != submission) {
        participant.status = SUBMISSION_TYPES.INCOMPLETE;
        // participant.status = 'incomplete'
        await participant.save()
        return participant
      }
    }
    if (!challenge.autoGrade) {
      // participant.status = SUBMISSION_TYPES.SUBMITTED;
      participant.status = 'submitted'
      participant.submission = submission;
      await participant.save()
      return participant
    }
    return participant
  }
}

export const challengesService = new ChallengesService()