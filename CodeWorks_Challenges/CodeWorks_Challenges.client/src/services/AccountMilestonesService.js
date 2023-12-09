import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { Milestone } from "../models/Milestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class AccountMilestonesService {

  async checkMilestonesByAccountId(userId, checks) { //STUB Kyle -- this is a post because a get can't carry a payload and it creates one if it isn't already there~~
    const res = await api.post(`api/accountMilestones/${userId}`, checks)
    logger.log('[checkMilestonesByAccountId]', res.data)
    AppState.myMilestone = res.data.map(m => new AccountMilestone(m))
  }

  async getAccountMilestones(userId) {
    const res = await api.get(`api/accountMilestones/${userId}`)
    logger.log('[getAccountMilestones]', res.data)
    AppState.myMilestone = res.data.map(m => new AccountMilestone(m))
  }

  async claimMilestone(accountMilestone) {
    const res = await api.put(`account/${accountMilestone.id}/accountMilestone`)
    logger.log('[claimMilestone]', res.data)
    const updateMilestone = AppState.myMilestone.find(m => m.id == accountMilestone.id)
    logger.log('[APPSTATE MY MILESTONES]', AppState.myMilestone, '[UPDATE MILESTONE]', updateMilestone)
    updateMilestone.claimed = true
  }
}

export const accountMilestonesService = new AccountMilestonesService()