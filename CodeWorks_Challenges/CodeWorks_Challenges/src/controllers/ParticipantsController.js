import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ParticipantsController extends BaseController{
    constructor(){
      super('api/participants')
      this.router
        .use(Auth0Provider.getAuthorizedUserInfo)
        .post('', this.createParticipant)
        .delete('/:participantId', this.removeParticipant)
    }
    
    async createParticipant(req, res, next){
      try {
          const participantData = req.body

          participantData.accountId = req.userInfo.id

          const participant = await participantsService.createParticipant(participantData)

          return res.send(participant)
      } catch (error) {
          next(error)
      }
    }

    async removeParticipant(req, res, next) {
      try {
          const participantId = req.params.participantId

          const userId = req.userInfo.id

          const participantToRemove = await participantsService.removeParticipant(participantId, userId)

          return res.send(participantToRemove)
      } catch (error) {
          next(error)
      }
    }
}