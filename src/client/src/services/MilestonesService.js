import { AppState } from "../AppState.js"
import { Milestone } from "../models/Milestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class MilestonesService {

  async getMilestones() {
    const res = await api.get('api/milestones');
    const milestones = res.data.map(m => new Milestone(m));
    logger.log('[MILESTONES SERVICE] getMilestones:: ' + milestones);
    AppState.MilestoneState.milestones = milestones;
  }

  async createMilestone(milestoneData) {
    const res = await api.post('api/milestones', milestoneData);
    const milestone = new Milestone(res.data);
    logger.log('[MILESTONES SERVICE] createMilestone:: ' + milestone);
    AppState.MilestoneState.milestones.push(milestone);
  }

  async editMilestone(milestoneData) {
    const res = await api.put(`api/milestones/${milestoneData.id}`, milestoneData);
    const milestoneIndex = AppState.MilestoneState.milestones.findIndex(m => m.id == milestoneData.id);
    const newMilestone = new Milestone(res.data);
    logger.log('[MILESTONES SERVICE] editMilestone:: ' + newMilestone);
    AppState.MilestoneState.milestones.splice(milestoneIndex, newMilestone);
  }

  async removeMilestone(milestoneId) {
    const res = await api.delete(`api/milestones/${milestoneId}`);
    const milestoneIndex = AppState.MilestoneState.milestones.findIndex(m => m.id == milestoneId);
    AppState.MilestoneState.milestones.splice(milestoneIndex);
    logger.log('[MILESTONES SERVICE] removeMilestone:: ' + res.data);
  }

}

export const milestonesService = new MilestonesService();