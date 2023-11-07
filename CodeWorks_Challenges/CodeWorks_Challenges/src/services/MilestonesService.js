import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";

class MilestonesService {

  async createMilestone(milestoneData) {
    const milestone = await dbContext.Milestones.create(milestoneData)
    return milestone
  }
  async getMilestones() {
    const milestones = await dbContext.Milestones.find()
    return milestones
  }
  async editMilestone(milestoneId, milestoneData) {
    const editMilestone = await dbContext.Milestones.findById(milestoneId)
    editMilestone.check = milestoneData.check
    editMilestone.logic = milestoneData.logic
    editMilestone.ref = milestoneData.ref
    editMilestone.description = milestoneData.description
    await editMilestone.save();
  }

  async removeMilestone(milestoneId) {
    const milestone = await dbContext.Milestones.findById(milestoneId)
    if (!milestone) {
      throw new BadRequest(`milestone with ID ${milestoneId} does not exist`)
    }
    await milestone.remove()
  }
}

export const milestonesService = new MilestonesService()