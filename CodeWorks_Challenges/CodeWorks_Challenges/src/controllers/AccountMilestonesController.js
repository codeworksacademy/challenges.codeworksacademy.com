import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class AccountMilestonesController extends BaseController {
  constructor() {
    super('api/accountMilestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      // TODO [🚧 Kyle] verify fully functional and correctly secured
      .get('/:userId', this.getAccountMilestones)
      .post('/:userId', this.checkMilestonesByAccountId)
      .put('/:milestoneId', this.claimMilestone)
  }

  async getAccountMilestones(req, res, next) {
    // STUB Kyle -- The account controller might be a better spot for this call.
    try {
      const userId = req.params.userId
      const accountMilestones = await accountMilestonesService.getAccountMilestones(userId)
      return res.send(accountMilestones)
    } catch (error) {
      next(error);
    }
  }

  // REVIEW [Kyle] potentially move this to account controller, or implement a simple cache
  async checkMilestonesByAccountId(req, res, next) {
    try {
      const userId = req.params.userId
      const checks = req.body
      const milestones = await accountMilestonesService.checkMilestonesByAccountId(userId, checks)
      return res.send(milestones)
    } catch (error) {
      next(error);
    }
  }

  // FIXME [Kyle] This should be moved to the account controller
  async claimMilestone(req, res, next) {
    try {
      const milestoneId = req.params.milestoneId
      const milestone = await accountMilestonesService.claimMilestone(milestoneId)
      return res.send(milestone)
    } catch (error) {
      next(error);
    }
  }
}