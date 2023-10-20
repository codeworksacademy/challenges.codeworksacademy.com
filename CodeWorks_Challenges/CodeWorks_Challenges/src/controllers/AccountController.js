import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'
import { challengesService } from '../services/ChallengesService'
import { logger } from "../utils/Logger.js"
import { participantsService } from '../services/ParticipantsService'
import { answersService } from '../services/AnswersService.js'

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .get('/:accountId/challenges', this.getMyChallenges)
      .put('', this.updateAccount)
      .get('/participants', this.getParticipantsByAccount)
      .get('/answers', this.getMyAnswers)
  }

  async getUserAccount(req, res, next) {
    try {
      const account = await accountService.getAccount(req.userInfo)
      res.send(account)
    } catch (error) {
      next(error)
    }
  }

  async updateAccount(req, res, next) {
    try {
      const accountData = req.body
      const accountInfo = req.userInfo
      const account = await accountService.updateAccount(accountInfo, accountData)
      return res.send(account)
    } catch (error) {
      next(error);
    }
  }

  async getMyChallenges(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const challenges = await challengesService.getMyChallenges(accountId)
      res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getMyAnswers(req, res, next) {
    try {
      const accountId = req.userInfo.id

      const answers = await answersService.getMyAnswers(accountId)

      res.send(answers)
    } catch (error) {
      next(error)
    }
  }

  async getParticipantsByAccount(req, res, next) {
    try {
      const participants = await participantsService.getParticipantsByAccount(req.userInfo.id)
      res.send(participants)
    } catch (error) {
      next(error)
    }
  }
}
