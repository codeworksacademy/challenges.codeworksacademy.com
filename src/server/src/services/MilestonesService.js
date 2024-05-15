import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";

class MilestonesService {

  async getMilestones() {
    const milestones = await dbContext.Milestones.find();
    return milestones;
  }

  async getMilestoneById(milestoneId) {
    const milestone = await dbContext.Milestones.findById(milestoneId);
    return milestone;
  }

  async createMilestone(milestoneData) {
    const milestone = await dbContext.Milestones.create(milestoneData);
    return milestone;
  }

  async editMilestone(milestoneId, milestoneData) {
    const milestone = await dbContext.Milestones.findById(milestoneId);
    milestone.title = milestoneData.title;
    milestone.description = milestoneData.description;
    milestone.check = milestoneData.check;
    milestone.logic = milestoneData.logic;
    milestone.ref = milestoneData.ref;
    await milestone.save();
    return milestone;
  }

  async removeMilestone(milestoneId) {
    const milestone = await dbContext.Milestones.findById(milestoneId);
    if (!milestone) { throw new BadRequest(`milestone with ID ${milestoneId} does not exist`); }
    await milestone.remove();
    return 'The milestone has been successfully deleted';
  }
}

export const milestonesService = new MilestonesService();