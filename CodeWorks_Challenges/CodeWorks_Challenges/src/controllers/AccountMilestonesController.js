import { accountMilestonesService } from "../services/AccountMilestonesService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class MilestonesController extends BaseController {
  constructor() {
    super('api/accountMilestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      // .post('', this.createMilestone)
      // .get('', this.getMilestones)
      .get('/:userId', this.getAccountMilestones)
      .put('/:userId', this.checkMilestonesByAccountId)
    // .delete('/:milestoneId', this.removeMilestone)
  }
  // async createMilestone(req, res, next) {
  //   try {
  //     const milestoneData = req.body
  //     const milestone = await milestonesService.createMilestone(milestoneData)
  //     return res.send(milestone)
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async getMilestones(req, res, next) {
  //   try {
  //     const milestones = await milestonesService.getMilestones()
  //     return res.send(milestones)
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async removeMilestone(req, res, next) {
  //   try {
  //     const milestoneId = req.params.milestoneId
  //     const milestone = await milestonesService.removeMilestone(milestoneId)
  //     return res.send(milestone)
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  async getAccountMilestones(req, res, next) {
    try {
      const userId = req.params.userId
      const accountMilestones = await accountMilestonesService.getAccountMilestones(userId)
      return res.send(accountMilestones)
    } catch (error) {
      next(error);
    }
  }
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
}