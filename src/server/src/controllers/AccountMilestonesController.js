import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";

export class AccountMilestonesController extends BaseController {
  constructor() {
    super('api/accountMilestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .put('/claimMilestone/:accountMilestoneId', this.claimMyMilestone)
  }

  // 🔽 AUTHENTICATION REQUIRED 🔽

  async claimMyMilestone(req, res, next) {
    try {
      const accountMilestoneId = req.params.accountMilestoneId;
      const accountId = req.userInfo.id;
      const milestone = await accountMilestonesService.claimMyMilestone(accountMilestoneId, accountId);
      return res.send(milestone);
    }
    catch (error) { next(error); }
  }

}