import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ParticipantsController extends BaseController {
  constructor() {
    super('api/participants')
    this.router
      .get('/leaderboards', this.getLeaderboards)
      .get('/:participantId', this.getParticipantById)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.joinChallenge)
      .delete('/:participantId', this.leaveChallenge)
  }

  async getLeaderboards(req, res, next) {
    try {
      const participants = await participantsService.getLeaderboards()
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