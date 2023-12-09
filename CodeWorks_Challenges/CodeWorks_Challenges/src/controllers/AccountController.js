import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import { accountMilestonesService } from "../services/AccountMilestonesService.js"

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .get('/challenges', this.getMyChallenges)
      .get('/participations', this.getMyParticipations)
      .get('/rank', this.calculateAccountRank)
      .get('/reputation', this.calculateMyReputation)
      .put('', this.updateAccount)
      .put('/:milestoneId/accountMilestone', this.claimAccountMilestone)
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
      const challenges = await challengesService.getChallengesCreatedBy(accountId, accountId)
      res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getMyParticipations(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const answers = await participantsService.getMyParticipations(accountId)

      res.send(answers)
    } catch (error) {
      next(error)
    }
  }
  async claimAccountMilestone(req, res, next) {
    try {
      const milestoneId = req.params.milestoneId
      const userId = req.userInfo.id
      const milestone = await accountMilestonesService.claimAccountMilestone(milestoneId, userId)
      return res.send(milestone)
    } catch (error) {
      next(error);
    }
  }

  async calculateAccountRank(req, res, next) {
    try {
      const user = req.userInfo
      const rank = await accountService.calculateAccountRank(user)
      return res.send(rank)
    } catch (error) {
      next(error);
    }
  }

  async calculateMyReputation(req, res, next) {
    try {
      const reputationScore = await accountService.calculateMyReputation(req.userInfo)

      res.send(reputationScore)
    } catch (error) {
      next(error)
    }
  }
}
