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
      .get('/rank', this.calculateMyRank)
      .get('/reputation', this.calculateMyReputation)
      .put('', this.updateAccount)
      .put('/:milestoneId/accountMilestones', this.claimMyMilestone)
      .post('/accountMilestones', this.checkMilestonesByAccountId)
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
  async checkMilestonesByAccountId(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const userId = accountId
      const checks = req.body
      const milestones = await accountMilestonesService.checkMyMilestoneCache(accountId, userId, checks)
      return res.send(milestones)
    } catch (error) {
      next(error);
    }
  }
  async claimMyMilestone(req, res, next) {
    try {
      const milestoneId = req.params.milestoneId
      const userId = req.userInfo.id
      const milestone = await accountMilestonesService.claimMyMilestone(milestoneId, userId)
      return res.send(milestone)
    } catch (error) {
      next(error);
    }
  }

  async calculateMyRank(req, res, next) {
    try {
      const userId = req.userInfo.id
      const rank = await accountService.calculateMyRank(userId)
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
