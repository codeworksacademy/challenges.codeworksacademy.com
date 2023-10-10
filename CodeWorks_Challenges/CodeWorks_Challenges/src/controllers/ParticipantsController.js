import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ParticipantsController extends BaseController{
    constructor(){
      super('api/participants')
      this.router
        .use(Auth0Provider.getAuthorizedUserInfo)
        // .get('/:participantId', this.getParticipant)
        .post('', this.createParticipant)
        .delete('/:participantId', this.removeParticipant)
    }
    
    // async getParticipant(req, res, next){
    //   try {
    //       const participantId = req.params.id
    //       const participant = await participantsService.getParticipant(participantId)
    //       return res.send(participant)
    //   } catch (error) {
    //       next(error)
    //   }
    // }
    
    async createParticipant(req, res, next){
      try {
          const newParticipant = req.body
          newParticipant.accountId = req.userInfo.id
          const participant = await participantsService.createParticipant(newParticipant)
          return res.send(participant)
      } catch (error) {
          next(error)
      }
    }

    async removeParticipant(req, res, next) {
      try {
          const message = await participantsService.removeParticipant(req.params.participantId)
          return res.send(message)
      } catch (error) {
          next(error)
      }
    }
}