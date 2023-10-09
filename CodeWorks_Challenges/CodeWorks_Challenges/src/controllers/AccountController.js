import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .get('/challenges', this.getMyChallenges)
  }

  async getUserAccount(req, res, next) {
    try {
      const account = await accountService.getAccount(req.userInfo)
      res.send(account)
    } catch (error) {
      next(error)
    }
  }

  async getMyChallenges(req, res, next) {
    try {
      const myChallenges = req.userInfo.id
      const challenges = await challengesService.getMyChallenges(myChallenges)
      res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getMyParticipation(req, res, next) {
    try {
      const myParticipation = req.userInfo.id
      const participation = await participantsService.getMyParticipation(myParticipation)
      res.send(participation)
    } catch (error) {
      next(error)
    }
  }
}
