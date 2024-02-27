import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS, SUBMISSION_TYPES } from '../constants';
import { challengeModeratorsService } from "./ChallengeModeratorsService.js";
import { participantsService } from "./ParticipantsService.js";
import { accountService } from "./AccountService.js";
import { accountMilestonesService } from "./AccountMilestonesService.js";
import { SimpleCache } from "../utils/SimpleCache.js";

const EXPERIENCE_SCALE = {
  1: 10,
  2: 50,
  3: 250,
  4: 500,
  5: 1000
}

const COURSES_CACHE = new SimpleCache(60 * 60)


class ChallengesService {
  async gradeParticipant(participantData, accountId) {
    await challengeModeratorsService.getModeratorByUserIdAndChallengeId(accountId, participantData.challengeId);

    const participant = await participantsService.getParticipantById(participantData.participantId);

    if (
      participantData.status != SUBMISSION_TYPES.COMPLETED &&
      participantData.status != SUBMISSION_TYPES.RETURNED_FOR_REVIEW
    ) {
      throw new BadRequest('You cannot set the status type to ' + participantData.status);
    }

    participant.status = participantData.status;
    participant.requirements = participantData.requirements;

    if (accountId == participant.accountId) {
      throw new BadRequest('You cannot grade your own submission.');
    }

    accountMilestonesService.giveGradingMilestoneByAccountId(accountId)
    if (participantData.status == SUBMISSION_TYPES.COMPLETED) {
      participant.completedAt = new Date();
      this.awardExperience(participant);
    }

    await participant.save();
    return participant;
  }

  // This method is used to give the experience of a challenge to a userId
  // Triggered by grading or autoGrade
  async awardExperience(participant) {

    let challenge = participant.challenge;
    if (!challenge) {
      challenge = await this.getChallengeById(participant.challengeId);
    }

    await accountService.calculateAccountRank({ id: participant.accountId }, EXPERIENCE_SCALE[challenge.difficulty]);
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
    const challenges = await COURSES_CACHE.getEntry('all_challenges', () => dbContext.Challenges.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .select('-answer')
      .populate('creator', PROFILE_FIELDS)
      .populate('participantCount')
      .populate('completedCount'))
    return challenges
  }

  async getChallengeById(challengeId) {
    const challenge = await COURSES_CACHE.getEntry(challengeId, () => dbContext.Challenges.findById(challengeId)
      .select('-answer')
      .populate('creator', PROFILE_FIELDS)
      .populate('participantCount')
      .populate('completedCount'))

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
      ? await COURSES_CACHE.getEntry(profileId, () => dbContext.Challenges.find({ creatorId: profileId }).select('-answer')
        .populate('creator', PROFILE_FIELDS)
        .populate('participantCount')
        .populate('completedCount'))

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
    challenge.badge = challengeData.badge || challenge.badge;
    challenge.answer = challengeData.answer || challenge.answer

    COURSES_CACHE.clearKey(challengeId)

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

  async submitChallenge(participantData) {
    const challenge = await dbContext.Challenges.findById(participantData.challengeId);
    const participant = await participantsService.getParticipantById(participantData.id);

    participant.submission = participantData.submission;
    participant.status = participantData.status;

    if (participant.status == SUBMISSION_TYPES.COMPLETED) { return participant; }

    if (!challenge.autoGrade) {
      participant.status = SUBMISSION_TYPES.SUBMITTED;
      await participant.save();
      return participant;
    }

    // Auto Grade
    participant.status = challenge.answer == participantData.submission
      ? SUBMISSION_TYPES.COMPLETED
      : SUBMISSION_TYPES.RETURNED_FOR_REVIEW

    if (participant.status == SUBMISSION_TYPES.COMPLETED) {
      await this.awardExperience({ accountId: participant.accountId, challengeId: participant.challengeId, challenge })
    }
    await participant.save()
    return participant

  }
}





export const challengesService = new ChallengesService()