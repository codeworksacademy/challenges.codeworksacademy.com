import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { Milestone } from "../models/Milestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class AccountMilestonesService {

  async checkMilestonesByAccountId(userId, checks) {
    const res = await api.put(`api/accountMilestones/${userId}`, checks)
    logger.log('[checkMilestonesByAccountId]', res.data)
    AppState.myMilestone = res.data.map(m => new AccountMilestone(m))
  }

  async getAccountMilestones(userId) {
    const res = await api.get(`api/accountMilestones/${userId}`)
    logger.log('[getAccountMilestones]', res.data)
    AppState.myMilestone = res.data.map(m => new AccountMilestone(m))
  }

}

export const accountMilestonesService = new AccountMilestonesService()