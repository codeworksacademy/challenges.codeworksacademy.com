import { challengesService } from "../services/ChallengesService.js";
import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ParticipantsController extends BaseController {
  constructor() {
    super('api/participants')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.joinChallenge)
      .put('/:participantId', this.submitChallengeForGrading)
      .delete('/:participantId', this.leaveChallenge)
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

  async submitChallengeForGrading(req, res, next) {
    try {
      const participantId = req.params.participantId
      const userId = req.userInfo.id
      const newParticipant = req.body

      const updatedParticipant = await participantsService.submitChallengeForGrading(participantId, userId, newParticipant)
      return res.send(updatedParticipant)
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