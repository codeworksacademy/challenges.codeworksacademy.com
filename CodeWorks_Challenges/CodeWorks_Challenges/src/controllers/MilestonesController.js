import { milestonesService } from "../services/MilestonesService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class MilestonesController extends BaseController {
  constructor() {
    super('api/milestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createMilestone)
      .get('', this.getMilestones)
      .get('/:userId', this.getAccountMilestones)
      .put('/:userId', this.checkMilestonesByAccountId)
  }
  async createMilestone(req, res, next) {
    try {
      const milestoneData = req.body
      const milestone = await milestonesService.createMilestone(milestoneData)
      return res.send(milestone)
    } catch (error) {
      next(error);
    }
  }
  async getMilestones(req, res, next) {
    try {
      const milestones = await milestonesService.getMilestones()
      return res.send(milestones)
    } catch (error) {
      next(error);
    }
  }
  async getAccountMilestones(req, res, next) {
    try {
      const userId = req.params.userId
      const accountMilestones = await milestonesService.getAccountMilestones(userId)
      return res.send(accountMilestones)
    } catch (error) {
      next(error);
    }
  }
  async checkMilestonesByAccountId(req, res, next) {
    try {
      const userId = req.params.userId
      const checks = req.body
      const milestones = await milestonesService.checkMilestonesByAccountId(userId, checks)
      return res.send(milestones)
    } catch (error) {
      next(error);
    }
  }
}