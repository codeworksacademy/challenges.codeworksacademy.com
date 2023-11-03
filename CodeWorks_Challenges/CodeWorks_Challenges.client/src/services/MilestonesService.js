import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { Milestone } from "../models/Milestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class MilestonesService {

  async createMilestone(milestoneData) {
    const res = await api.post('api/milestones', milestoneData)
    logger.log(`[createMilestone]`, res.data)
    AppState.milestones.push(new Milestone(res.data))
  }
  async getMilestones() {
    const res = await api.get('api/milestones')
    logger.log('[getMilestones]', res.data)
    AppState.milestones = res.data.map(m => new Milestone(m))
  }

  async checkMilestonesByAccountId(userId, checks) {
    const res = await api.put(`api/milestones/${userId}`, checks)
    logger.log('[checkMilestonesByAccountId]', res.data)
  }

  async getAccountMilestones(userId) {
    const res = await api.get(`api/milestones/${userId}`)
    logger.log('[getAccountMilestones]', res.data)
    AppState.myMilestone = res.data.map(m => new AccountMilestone(m))
  }

}

export const milestonesService = new MilestonesService()