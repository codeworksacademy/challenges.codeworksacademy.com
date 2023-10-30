import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class MilestonesService {

  async checkMilestonesByAccountId(userId, checks) {
    const res = await api.get(`api/milestones/${userId}`, checks)
    logger.log('[checkMilestonesByAccountId]', res.data)
  }

  async getAccountMilestones(userId) {
    const res = await api.get(`api/milestones/${userId}`)
    logger.log('[getAccountMilestones]', res.data)
  }

}

export const milestonesService = new MilestonesService()