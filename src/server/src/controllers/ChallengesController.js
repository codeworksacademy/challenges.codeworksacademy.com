import BaseController from '../utils/BaseController.js'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { challengesService } from '../services/ChallengesService.js'
import { participantsService } from '../services/ParticipantsService.js'
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"

export class ChallengesController extends BaseController {
  constructor() {
    super('api/challenges')
    this.router
      .get('', this.getAllChallenges)
      .get('/:challengeId', this.getChallengeById)
      .get('/:challengeName/search', this.findChallengesByQuery)
      .get('/:challengeId/participants', this.getParticipantsByChallengeId)
      .get('/:challengeId/moderators', this.getModeratorsByChallengeId)

      .use(Auth0Provider.getAuthorizedUserInfo)

      .post('', this.createChallenge)
      .put('/:challengeId', this.editChallenge)
      .put('/:challengeId/participants/:participantId', this.gradeParticipant)
      // .delete('/:challengeId/participants', this.removeParticipant)

      .put('/:challengeId/submit', this.submitChallenge)
      .put('/:challengeId/reputation', this.giveReputation)
  }

  async getAllChallenges(req, res, next) {
    try {
      const challenges = await challengesService.getAllChallenges();
      return res.send(challenges);
    }
    catch (error) { next(error); }
  }

  async getChallengeById(req, res, next) {
    try {
      const challengeId = req.params.challengeId;
      const challenge = await challengesService.getChallengeById(challengeId);
      return res.send(challenge);
    }
    catch (error) { next(error); }
  }

  async findChallengesByQuery(req, res, next) {
    //FIXME ⚠️ -- This works but does not return creator $lookup is broken (I don't know how to use it)
    try {
      const name = req.params.challengeName;
      const offset = 0;  // ?
      const challenges = await challengesService.findChallengesByQuery(name, offset);
      return res.send(challenges);
    }
    catch (error) { next(error); }
  }

  async getParticipantsByChallengeId(req, res, next) {
    try {
      const challengeId = req.params.challengeId;
      const participants = await participantsService.getParticipantsByChallengeId(challengeId);
      return res.send(participants);
    }
    catch (error) { next(error); }
  }

  async getModeratorsByChallengeId(req, res, next) {
    try {
      const challengeId = req.params.challengeId;
      const moderators = await challengeModeratorsService.getModeratorsByChallengeId(challengeId);
      return res.send(moderators);
    }
    catch (error) { next(error); }
  }

  // 🔽 AUTHENTICATION REQUIRED 🔽

  // SECTION START: MODERATOR_CHALLENGE_ACTIONS

  async createChallenge(req, res, next) {
    try {
      const challengeData = req.body;
      challengeData.creatorId = req.userInfo.id;
      const challenge = await challengesService.createChallenge(challengeData);
      return res.send(challenge);
    }
    catch (error) { next(error); }
  }

  async editChallenge(req, res, next) {
    try {
      const challengeData = req.body;
      const accountId = req.userInfo.id;
      const challengeId = req.params.challengeId;
      const challenge = await challengesService.editChallenge(challengeData, accountId, challengeId);
      return res.send(challenge);
    }
    catch (error) { next(error); }
  }

  async gradeParticipant(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const participant = await challengesService.gradeParticipant(req.body, accountId);
      return res.send(participant);
    }
    catch (error) { next(error); }
  }

  // NOTE Not in use anywhere yet
  // async removeParticipant(req, res, next) {
  //   try {
  //     const challengeId = req.params.challengeId;
  //     const participant = req.body;
  //     const accountId = req.userInfo.id;
  //     const p = await participantsService.removeParticipant(challengeId, accountId, participant);
  //     res.send(p);
  //   }
  //   catch (error) { next(error); }
  // }

  // !SECTION END: MODERATOR_CHALLENGE_ACTIONS

  // SECTION START: PARTICIPANT_ACTIONS

  async submitChallenge(req, res, next) {
    try {
      const submission = req.body;
      submission.accountId = req.userInfo.id;
      const result = await challengesService.submitChallenge(submission);
      return res.send(result);
    }
    catch (error) { next(error); }
  }

  async giveReputation(req, res, next) {
    try {
      const challengeId = req.params.challengeId;
      const accountId = req.userInfo.id;
      const challenge = await challengesService.giveReputation(challengeId, accountId);
      return res.send(challenge);
    }
    catch (error) { next(error); }
  }

  // !SECTION END: PARTICIPANT_ACTIONS
}