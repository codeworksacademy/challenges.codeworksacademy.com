import { moderatorsService } from "../services/ModeratorsService.js";
import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ModeratorsController extends BaseController {
  constructor() {
    super('api/moderators')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createModeration)
      .delete('/:moderatorId', this.removeModeration)
  }

  async createModeration(req, res, next) {
    try {
      const moderatorData = req.body
      moderatorData.accountId = req.userInfo.id

      const moderation = await moderatorsService.createModeration(moderatorData)
      return res.send()
    } catch (error) {
      next(error);
    }
  }
  async removeModeration(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const userId = req.userInfo.id
      const moderatorToRemove = await moderatorsService.removeModeratoration(moderatorId, userId)
      return res.send(moderatorToRemove)
    } catch (error) {
      next(error);
    }
  }

  // async createParticipant(req, res, next){
  //   try {
  //     const participantData = req.body

  //     participantData.accountId = req.userInfo.id

  //     const participant = await participantsService.createParticipant(participantData)

  //     return res.send(participant)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // async leaveChallenge(req, res, next) {
  //   try {
  //     const participantId = req.params.participantId

  //     const userId = req.userInfo.id

  //     const participantToRemove = await participantsService.leaveChallenge(participantId, userId)

  //     return res.send(participantToRemove)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}