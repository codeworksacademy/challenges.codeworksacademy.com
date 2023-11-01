import { milestonesService } from "../services/MilestonesService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class MilestonesController extends BaseController {
  constructor() {
    super('api/milestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .get('/:userId', this.checkMilestonesByAccountId)
  }
  async checkMilestonesByAccountId(req, res, next) {
    try {
      const userId = req.params.userId
      const checks = req.body
      const userChecks = await milestonesService.checkMilestonesByAccountId(userId, checks)
      return res.send(userChecks)
    } catch (error) {
      next(error);
    }
  }
}