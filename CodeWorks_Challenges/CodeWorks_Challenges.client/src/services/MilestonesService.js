import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class MilestonesService {

  async createMilestone(milestoneData) {
    const res = await api.post('api/milestones', milestoneData)
    logger.log(`[createMilestone]`, res.data)
  }

  async checkMilestonesByAccountId(userId, checks) {
    const res = await api.get(`api/milestones/${userId}`, checks)
    logger.log('[checkMilestonesByAccountId]', res.data)
  }

  async getAccountMilestones(userId) {
    // const res = await api.get(`api/account/${userId}/milestones`)
    // logger.log('[getAccountMilestones]', res.data)
  }

}

export const milestonesService = new MilestonesService()