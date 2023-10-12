import BaseController from '../utils/BaseController.js'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { challengesService } from '../services/ChallengesService.js'
import { participantsService } from '../services/ParticipantsService.js'

export class ChallengesController extends BaseController {
  constructor() {
    super('api/challenges')
    this.router
      .get('', this.getAllChallenges)
      .get('/:challengeId', this.setActiveChallenge)
      .get('/:challengeId/participants', this.getParticipantsByChallengeId)

      .use(Auth0Provider.getAuthorizedUserInfo)

      .post('', this.createChallenge)
      .put('/:challengeId', this.editChallenge)
      .put('/:challengeId', this.cancelChallenge)
      .delete('/:challengeId', this.deleteChallenge)
  }

  async getAllChallenges(req, res, next) {
    try {
      const challenges = await challengesService.getAllChallenges()
      return res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getParticipantsByChallengeId(req, res, next) {
    try {
      const challengeId = req.params.challengeId

      const participants = await participantsService.getParticipantsByChallengeId(challengeId)

      return res.send(participants)
    } catch (error) {
      next(error)
    }
  }

  async createChallenge(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const challenge = await challengesService.createChallenge(req.body)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }


  async setActiveChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const challenge = await challengesService.setActiveChallenge(challengeId)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async editChallenge(req, res, next) {
    try {
      const newChallenge = req.body
      const userId = req.userInfo.id
      const challengeId = req.params.challengeId
      const challenge = await challengesService.editChallenge(newChallenge, userId, challengeId)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async cancelChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      await challengesService.cancelChallenge(challengeId, userId)
      return res.send(challengeId)
    } catch (error) {
      next(error)
    }
  }

  async deleteChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      await challengesService.deleteChallenge(challengeId, userId)
      return res.send(challengeId)
    } catch (error) {
      next(error)
    }
  }
}