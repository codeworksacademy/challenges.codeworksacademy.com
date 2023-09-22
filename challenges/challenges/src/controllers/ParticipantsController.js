import { Auth0Provider } from '@bcwdev/auth0provider'
import BaseController from '../utils/BaseController.js'
import { participantsService } from '../services/ParticipantsService.js'

export class ParticipantsController extends BaseController {
  constructor(){
    super('api/participants')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createParticipant)
      .get('/:partId', this.getParticipantById)
    //.put('/:id', this.editParticipant)
      .delete('/:partId', this.removeParticipant)
  }

  async createParticipant(req, res, next) {
    try {
      req.body.accountId = req.userInfo.id
      const participant = await participantsService.createParticipant(req.body)
      res.send(participant)
    } catch (error) {
      next(error)
    }
  }

  async getParticipantById(req, res, next) {
    try {
      const participantId = req.params.partId
      const participant = await participantsService.getParticipantById(participantId)
      res.send(participant)
    } catch (error) {
      next(error)
    }
  }

  async removeParticipant(req, res, next) {
    try {
      const participantId = req.params.partId
      const userId = req.userInfo.id
      const message = await participantsService.removeParticipant(participantId, userId)
      res.send(message)
    } catch (error) {
      next(error)
    }
  }



}