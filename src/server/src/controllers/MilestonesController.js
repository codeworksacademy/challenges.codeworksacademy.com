// MilestonesController.js
import { milestonesService } from "../services/MilestonesService.js";
import BaseController from "../utils/BaseController.js";
import { Auth0Provider } from "@bcwdev/auth0provider";

export class MilestonesController extends BaseController {
  constructor() {
    super('api/milestones');
    this.router
      .get('/account/:accountId', this.getMilestonesByAccount)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('/account/:accountId', this.createMilestone)
      .put('/:milestoneId', this.updateMilestone)
      .delete('/:milestoneId', this.deleteMilestone)
      .post('/:milestoneId/claim', this.claimMilestone);
  }

  async getMilestonesByAccount(req, res, next) {
    try {
      const milestones = await milestonesService.getMilestonesByAccountId(req.params.accountId);
      return res.send(milestones);
    } catch (error) {
      next(error);
    }
  }

  async createMilestone(req, res, next) {
    try {
      const milestone = await milestonesService.createMilestone(req.params.accountId, req.body);
      return res.send(milestone);
    } catch (error) {
      next(error);
    }
  }

  async updateMilestone(req, res, next) {
    try {
      const milestone = await milestonesService.updateMilestone(req.params.milestoneId, req.body);
      return res.send(milestone);
    } catch (error) {
      next(error);
    }
  }

  async deleteMilestone(req, res, next) {
    try {
      const milestone = await milestonesService.deleteMilestone(req.params.milestoneId);
      return res.send(milestone);
    } catch (error) {
      next(error);
    }
  }

  async claimMilestone(req, res, next) {
    try {
      const milestone = await milestonesService.claimMilestone(req.params.milestoneId, req.userInfo.id);
      return res.send(milestone);
    } catch (error) {
      next(error);
    }
  }
}
