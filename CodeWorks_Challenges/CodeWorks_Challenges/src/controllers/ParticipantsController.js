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
      const participantData = req.body

      participantData.accountId = req.userInfo.id

      const participant = await participantsService.joinChallenge(participantData)

      return res.send(participant)
    } catch (error) {
      next(error)
    }
  }

  async submitChallengeForGrading(req, res, next) {
    try {
      const participantId = req.params.participantId
      const userId = req.userInfo.id
      const participantData = req.body

      const uodatedParticipant = await participantsService.submitChallengeForGrading(participantId, userId, participantData)
      return res.send(uodatedParticipant)
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