import { challengesService } from "../services/ChallengesService.js";
import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ParticipantsController extends BaseController {
  constructor() {
    super('api/participants')
    this.router
      .get('/leaderboards', this.getParticipants)
      .get('/:participantId', this.getParticipantById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.joinChallenge)
      .put('/:participantId', this.updateChallengeParticipant)
      .get('/:participantId/badges', this.getChallengeBadges)
      .delete('/:participantId', this.leaveChallenge)
  }

  async getParticipants(req, res, next) {
    try {
      const participants = await participantsService.getParticipantsLeaderboards()
      return res.send(participants)
    } catch (error) {
      next(error)
    }
  }

  async getParticipantById(req, res, next) {
    try {
      const participantId = req.params.participantId
      const participant = await participantsService.getParticipantById(participantId)

      return res.send(participant)
    } catch (error) {
      next(error)
    }
  }

  async joinChallenge(req, res, next) {
    try {
      const newParticipant = req.body
      newParticipant.accountId = req.userInfo.id

      const participant = await participantsService.joinChallenge(newParticipant)

      return res.send(participant)
    } catch (error) {
      next(error)
    }
  }

  async getChallengeBadges(req, res, next) {
    try {
      const participant = await participantsService.getParticipantById(req.params.id);

      // Assuming you have account and profile objects available
      const accountId = participant.accountId
      participantsService.getChallengeBadges(participant, accountId);

      // ... any other necessary logic or response

    } catch (error) {
      next(error);
    }
  }

  async updateChallengeParticipant(req, res, next) {
    try {
      const participantId = req.params.participantId
      const userId = req.userInfo.id
      const newSubmission = req.body

      const participant = await participantsService.updateChallengeParticipant(participantId, userId, newSubmission)
      return res.send(participant)
    } catch (error) {
      next(error)
    }
  }

  async leaveChallenge(req, res, next) {
    try {
      const participantId = req.params.participantId
      const userId = req.userInfo.id

      const participantToRemove = await participantsService.leaveChallenge(participantId, userId)

      return res.send(participantToRemove)
    } catch (error) {
      next(error)
    }
  }
}