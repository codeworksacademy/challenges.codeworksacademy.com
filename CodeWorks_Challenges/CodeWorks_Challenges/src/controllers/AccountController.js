import { Auth0Provider } from '@bcwdev/auth0provider'
import { accountService } from '../services/AccountService'
import BaseController from '../utils/BaseController'
import { challengesService } from '../services/ChallengesService'
import { participantsService } from '../services/ParticipantsService'
import { accountMilestonesService } from "../services/AccountMilestonesService.js"
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"

export class AccountController extends BaseController {
  constructor() {
    super('account')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('', this.getUserAccount)
      .get('/challenges', this.getMyChallenges)
      .get('/participation', this.getMyParticipation)
      .get('/moderation', this.getMyModeration)
      // .get('/rank', this.calculateAccountRank)
      // .get('/reputation', this.calculateAccountReputation)
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

  async getMyParticipation(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const answers = await participantsService.getMyParticipation(accountId)
      res.send(answers)
    } catch (error) {
      next(error)
    }
  }

  async getMyModeration(req, res, next) {
    try {
      const accountId = req.userInfo.id
      const answers = await challengeModeratorsService.getMyModerations(accountId)
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

  // async calculateAccountRank(req, res, next) {
  //   try {
  //     const user = req.userInfo
  //     const rank = await accountService.calculateAccountRank(user)
  //     return res.send(rank)
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async calculateAccountReputation(req, res, next) {
  //   try {
  //     const reputationScore = await accountService.calculateAccountReputation(req.userInfo)

  //     res.send(reputationScore)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // async getAccountBadges(req, res, next) {
  //   try {
  //     const badges = await accountService.getAccountBadges(req.userInfo)
  //     return res.send(badges)
  //   } catch (error) {
  //     next(error)
  //   }
  // }
}
