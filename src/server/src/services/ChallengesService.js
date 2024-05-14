import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS, SUBMISSION_TYPES } from '../constants';
import { challengeModeratorsService } from "./ChallengeModeratorsService.js";
import { participantsService } from "./ParticipantsService.js";
import { accountService } from "./AccountService.js";
import { SimpleCache } from "../utils/SimpleCache.js";
import { accountMilestonesService } from "./AccountMilestonesService.js";

const EXPERIENCE_SCALE = {
  1: 10,
  2: 50,
  3: 250,
  4: 500,
  5: 1000
}

const COURSES_CACHE = new SimpleCache(60 * 60); // in seconds

class ChallengesService {

  // SECTION from Challenge Controller
  async getAllChallenges() {
    const challenges = await COURSES_CACHE.getEntry('all_challenges', () => dbContext.Challenges
      .find({ status: 'published' })
      .sort({ createdAt: -1 })
      .select('name category difficulty reputationIds')
      .populate('completedCount'));
    return challenges;
  }

  async getChallengeById(challengeId) {
    const challenge = await COURSES_CACHE.getEntry(challengeId, () => dbContext.Challenges
      .findById(challengeId)
      .select('-answer')
      .populate('creator', PROFILE_FIELDS)
      .populate('participantCount')
      .populate('completedCount'))
    if (!challenge) { throw new BadRequest('Invalid Challenge ID.') }
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

  // 🔽 AUTHENTICATION REQUIRED 🔽

  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge);
    await challengeModeratorsService.addModerator({
      challengeId: challenge.id,
      accountId: challenge.creatorId,
      originId: challenge.creatorId,
      status: 'active'
    });
    return challenge;
  }

  async editChallenge(challengeData, accountId, challengeId) {
    const challenge = await this.getChallengeById(challengeId);
    const isChallengeModerator = await challengeModeratorsService.getModeratorByAccountIdAndChallengeId(accountId, challengeId);
    if (!isChallengeModerator || challenge.creatorId != accountId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: Only the creator of ${challenge.name} or a moderator can edit.`
      );
    }
    challenge.name = challengeData.name || challenge.name;
    challenge.category = challengeData.category || challenge.category;
    challenge.difficulty = challengeData.difficulty || challenge.difficulty;
    challenge.status = challengeData.status || challenge.status;
    challenge.coverImg = challengeData.coverImg || challenge.coverImg;
    challenge.autoGrade = challengeData.autoGrade || challenge.autoGrade;
    challenge.answer = challengeData.answer || challenge.answer;
    challenge.description = challengeData.description || challenge.description;
    challenge.requirements = challengeData.requirements || challenge.requirements;
    challenge.supportLinks = challengeData.supportLinks || challenge.supportLinks;
    challenge.badge = challengeData.badge || challenge.badge;

    COURSES_CACHE.clearKey(challengeId);
    await challenge.save();

    if (challenge.status == 'published') {
      COURSES_CACHE.clearKey('all_challenges');
    }
    return challenge;
  }

  async gradeParticipant(participantResults, moderatorId) {
    if (
      participantResults.status != SUBMISSION_TYPES.COMPLETED &&
      participantResults.status != SUBMISSION_TYPES.RETURNED_FOR_REVIEW
    ) {
      throw new BadRequest('Unable to set status type: ' + participantResults.status );
    }
    const isModerator = await challengeModeratorsService.getModeratorByAccountIdAndChallengeId(moderatorId, participantResults.challengeId);
    if (!isModerator) {
      throw new BadRequest('You are not an authorized moderator of this challenge.');
    }
    const participant = await participantsService.getParticipantById(participantResults.participantId);
    if (moderatorId == participant.accountId) {
      throw new BadRequest('You cannot grade your own submission.');
    }

    participant.status = participantResults.status; // latest overall status only
    participant.requirements = participantResults.requirements; // update status per requirement
    participant.feedback.push({
      comment: participantResults.feedback,
      returnedStatus: participantResults.status,
      moderatorId,
    });

    if (participantResults.status == SUBMISSION_TYPES.COMPLETED) {
      this.uponCompletion(participant);
    }
    await participant.save();
    
    // increment count for moderator grading milestone regardless of pass/retry
    accountMilestonesService.triggerAccountMilestone('gradeModerators', moderatorId); // "GRADER" - gradeModerators

    return participant;
  }

  uponCompletion(participant) {
    participant.completedAt = new Date();
    accountMilestonesService.triggerAccountMilestone('passingParticipant', participant.accountId); // "COMPLETIONIST" - passingParticipant
    accountMilestonesService.triggerAccountMilestone('passingSubmissionsChallenge', null, participant.challengeId); // "TEACHER" - passingSubmissionsChallenge
    // TODO + award challenge badge
  }

  async submitChallenge(participantData) {
    const challenge = await dbContext.Challenges.findById(participantData.challengeId);
    const participant = await participantsService.getParticipantById(participantData.id);

    participant.submission = participantData.submission;
    participant.status = participantData.status;

    accountMilestonesService.triggerAccountMilestone('submittedParticipant', participantData.accountId, challenge.id); // "STUDENT" - submittedParticipant
    accountMilestonesService.triggerAccountMilestone('submissionsChallenge', null, challenge.id); // "TRAINER" - submissionsChallenge

    if (!challenge.autoGrade) {
      participant.status = SUBMISSION_TYPES.SUBMITTED;
      await participant.save();
      return participant;
    }

    // Auto Grade
    participant.status = challenge.answer == participantData.submission
      ? SUBMISSION_TYPES.COMPLETED
      : SUBMISSION_TYPES.RETURNED_FOR_REVIEW;

    if (participant.status == SUBMISSION_TYPES.COMPLETED) {
      this.uponCompletion(participant);
    }
    await participant.save();
    return participant;
  }

  async giveReputation(challengeId, accountId) {
    const challenge = await this.getChallengeById(challengeId)
    // @ts-ignore
    const challengeCreator = challenge.creator
    await dbContext.Account.findById(challengeCreator.id)
    const index = challenge.reputationIds.findIndex(i => i === accountId)
    if (index === -1) {
      challenge.reputationIds.push(accountId)
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

  // !SECTION from Challenge Controller




  //  SECTION additional functions

  // This method is used to give the experience of a challenge to a accountId
  // Triggered by grading or autoGrade
  async awardExperience(participant) {
    const challenge = await this.getChallengeById(participant.challengeId);
    await accountService.calculateAccountRank({ id: participant.accountId }, EXPERIENCE_SCALE[challenge.difficulty]);
  }

  //The challenge will have auto-answer populated if creatorID matches
  async getChallengesCreatedBy(profileId, accountId) {
    const challenges = accountId != profileId
      ? await COURSES_CACHE.getEntry(profileId, () => dbContext.Challenges.find({ creatorId: profileId })
        .select('-answer')
        .populate('creator', PROFILE_FIELDS)
        .populate('participantCount')
        .populate('completedCount'))

      : await dbContext.Challenges.find({ creatorId: profileId })
        .populate('creator', PROFILE_FIELDS)
        .populate('participantCount')
        .populate('completedCount')

    return challenges
  }

}

export const challengesService = new ChallengesService()