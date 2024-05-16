import { PROFILE_FIELDS, STATUS_TYPES } from '../constants'
import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { accountService } from "./AccountService.js"
import { challengeModeratorsService } from "./ChallengeModeratorsService.js"
import { challengesService } from "./ChallengesService.js"

const EXPERIENCE_SCALE = {
  1: 10,
  2: 50,
  3: 250,
  4: 500,
  5: 1000
}

class ParticipantsService {

  async getLeaderboards() {
    const accounts = await dbContext.Account.find().select(PROFILE_FIELDS).populate('badges');
    return accounts;
  }

  async joinChallenge(newParticipant) {
    const challenge = await challengesService.getChallengeById(newParticipant.challengeId);
    if (challenge.status != STATUS_TYPES.PUBLISHED) {
      throw new BadRequest(`[CHALLENGE_STATUS::${challenge.status}] This challenge cannot be joined at this time.`)
    }

    newParticipant.requirements = challenge.requirements.map(r => {
      return {
        description: r,
        isCompleted: false
      }
    });
    const participant = await dbContext.ChallengeParticipants.create(newParticipant);
    return participant;
  }

  async getParticipantById(participantId) {
    const participant = await dbContext.ChallengeParticipants.findById(participantId)
      .populate('profile');
    if (!participant) {
      throw new BadRequest('Invalid participant ID.');
    }
    return participant;
  }

  // I already know what the challenge is so no need to populate the challenge 
  async getParticipantsByChallengeId(challengeId) {
    const participants = await dbContext.ChallengeParticipants.find({ challengeId })
      .select('-submission')
      .populate('profile', PROFILE_FIELDS)
      // .populate({
      //   path: 'feedback',
      //   populate: {
      //     path: 'moderator',
      //     model: 'Account'
      //   }
      // })
      // .exec();
    return participants;
  }

  // I know who I am looking for so no need to populate the profile
  async getParticipationByAccountId(accountId) {
    const participation = await dbContext.ChallengeParticipants.find({ accountId: accountId }).populate({
      path: 'challenge',
      populate: { path: 'creator' }
    })
    return participation
  }

  async leaveChallenge(participantId, accountId) {
    const participantToRemove = await dbContext.ChallengeParticipants.findById(participantId);
    if (!participantToRemove) {
      throw new BadRequest("Invalid participant ID.");
    }
    if (accountId != participantToRemove.accountId) {
      throw new Forbidden("[PERMISSIONS ERROR]: You may not remove other participants.");
    }
    participantToRemove.status = 'left';
    await participantToRemove.remove();
    return participantToRemove;
  }

    async removeParticipant(challengeId, accountId, participant) {
      const moderators = await challengeModeratorsService.getModeratorsByChallengeId(challengeId);
      const participantToRemove = await dbContext.ChallengeParticipants.findById(participant.id);

      if (!moderators.includes(accountId)) {
        throw new Forbidden(`[PERMISSIONS ERROR]: You are not a moderator.`)
      }

      if (!participantToRemove) {
        throw new BadRequest('Invalid participant ID.')
      }

      await participantToRemove.remove();
      return 'Participant association has been deleted.'
    }
}

export const participantsService = new ParticipantsService();