import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { PROFILE_FIELDS } from '../constants';
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
    
    // await accountService.calculateAccountRank({ id: participant.accountId },  EXPERIENCE_SCALE[challenge.difficulty])
    //TODO check out experience scale
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
    const challenge = (await this.getChallengeById(challengeId))

    if (challenge.creatorId == userId) {
      throw new BadRequest('You cannot give reputation to yourself.')
    }
    
    const challengeCreator = await accountService.getAccount({ id: challenge.creatorId })
    const index = challenge.reputationIds.findIndex(i => i == userId)
    if (index != -1) {
      challenge.reputationIds.splice(index, 1)
      challengeCreator.reputation -= 1
    } else {
      challenge.reputationIds.push(userId)
      challengeCreator.reputation += 1
    }

    // await accountService.calculateAccountRank({ id: challengeCreator.id })

    await challenge.save()
    await challengeCreator.save()

    return challenge
  }

  async submitChallenge(challengeId, participantId, submission, accountId) {
    const participant = await participantsService.getParticipantById(participantId)
    //TODO Get Account so you can increase their experience
    const challenge = await dbContext.Challenges.findById(challengeId)
    if(accountId != participant.accountId){
      throw new Forbidden("You are not allowed to change this participant's submission")
    }
    if(challenge.autoGrade){
      if (challenge.answer == submission) {
        participant.status = 'completed';
        // await this.awardExperience(participant)
        await participant.save()
        return participant
      } else {
        return 'incorrect'
      }
    }
    if(!challenge.autoGrade){
      participant.submission = submission;
      participant.status = 'submitted',
      await participant.save()
      return participant
    }
    return participant;
  }
}

export const challengesService = new ChallengesService()