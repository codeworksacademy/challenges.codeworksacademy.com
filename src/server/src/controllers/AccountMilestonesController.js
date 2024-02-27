import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class AccountMilestonesController extends BaseController {
  constructor() {
    super('api/accountMilestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('/:userId', this.getMyMilestones)
      .post('/:userId', this.checkMilestonesByUserId)
  }

  // 🔽 AUTHENTICATION REQUIRED 🔽

  async getMyMilestones(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const accountMilestones = await accountMilestonesService.getMyMilestones(accountId);
      return res.send(accountMilestones);
    }
    catch (error) { next(error); }
  }

  async checkMilestonesByUserId(req, res, next) {
    try {
      const accountId = req.userInfo.id;
      const userId = req.params.userId;
      const checks = req.body;
      // const milestones = await accountMilestonesService.checkMyMilestoneCache(accountId, userId, checks);
      // return res.send(milestones);
    }
    catch (error) { next(error); }
  }

}