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
      .get('/myModerations', this.getMyModerations)
      .get('/challengeModerators', this.getMyChallengeModerators)
      .put('/:milestoneId/accountMilestones', this.claimMyMilestone)
      .post('/accountMilestones', this.checkMilestonesByAccountId)
  }

  // 🔽 AUTHENTICATION REQUIRED 🔽

  async getUserAccount(req, res, next) {
    try {
      // TODO might want to calculate account Rank as I login
      const account = await accountService.getAccount(req.userInfo)
      return res.send(account)
    }
    catch (error) { next(error); }
  }

  async getMyChallenges(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const challenges = await challengesService.getChallengesCreatedBy(accountId, accountId);
      return res.send(challenges);
    }
    catch (error) { next(error); }
  }

  async getMyParticipation(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const answers = await participantsService.getParticipationByUserId(accountId);
      return res.send(answers);
    }
    catch (error) { next(error); }
  }

  async getMyModerations(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const answers = await challengeModeratorsService.getMyModerations(accountId);
      return res.send(answers);
    }
    catch (error) { next(error); }
  }

  async getMyChallengeModerators(req, res, next) {
    try {
      const userId = req.userInfo.id;
      const moderations = await challengeModeratorsService.getModerationsByChallengeCreatorId(userId);
      return res.send(moderations);
    }
    catch (error) { next(error); }
  }


  async claimMyMilestone(req, res, next) {
    try {
      const milestoneId = req.params.milestoneId;
      const userId = req.userInfo.id;
      const milestone = await accountMilestonesService.claimMyMilestone(milestoneId, userId);
      return res.send(milestone);
    }
    catch (error) { next(error); }
  }

  async checkMilestonesByAccountId(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const userId = accountId;
      const checks = req.body;
      // const milestones = await accountMilestonesService.checkMyMilestoneCache(accountId, userId, checks);
      // return res.send(milestones);
    }
    catch (error) { next(error); }
  }

  // async calculateAccountRank(req, res, next) {
  //   try {
  //     const user = req.userInfo
  //     const rank = await accountService.calculateAccountRank(user)
  //     return res.send(rank)
  //   } 
  //   catch(error) { next(error); }
  // }

  // async calculateAccountReputation(req, res, next) {
  //   try {
  //     const reputationScore = await accountService.calculateAccountReputation(req.userInfo)
  //     res.send(reputationScore)
  //   } 
  //   catch(error) { next(error); }
  // }

  // async getAccountBadges(req, res, next) {
  //   try {
  //     const badges = await accountService.getAccountBadges(req.userInfo)
  //     return res.send(badges)
  //   } 
  //   catch(error) { next(error); }
  // }
}
