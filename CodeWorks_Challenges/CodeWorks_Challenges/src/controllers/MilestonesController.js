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
      .put('/:milestoneId', this.editMilestone)
      .delete('/:milestoneId', this.removeMilestone)
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
  async editMilestone(req, res, next) {
    try {
      const milestoneData = req.body
      const milestoneId = req.params.milestoneId
      const milestone = await milestonesService.editMilestone(milestoneId, milestoneData)
      return res.send(milestone)
    } catch (error) {
      next(error);
    }
  }
  async removeMilestone(req, res, next) {
    try {
      const milestoneId = req.params.milestoneId
      const milestone = await milestonesService.removeMilestone(milestoneId)
      return res.send(milestone)
    } catch (error) {
      next(error);
    }
  }
}