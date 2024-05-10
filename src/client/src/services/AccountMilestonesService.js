import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class AccountMilestonesService {

  async getMyMilestones() {
    const res = await api.get('account/milestones');
    AppState.AccountState.milestones = res.data.map(m => new AccountMilestone(m));
    logger.log('[ACCOUNT MILESTONES SERVICE] getMyMilestones', AppState.AccountState.milestones);
  }

  async getAccountMilestonesByUserId(userId) {
    const res = await api.get(`api/accountMilestones/${userId}`);
    AppState.ProfileState.milestones = res.data.map(m => new AccountMilestone(m));
    logger.log('[ACCOUNT MILESTONES SERVICE] getAccountMilestonesByUserId', AppState.ProfileState.milestones);
  }

  async claimMilestone(accountMilestone) {
    const res = await api.put(`api/accountMilestones/claimMilestone/${accountMilestone.id}`);
    const milestone = AppState.AccountState.milestones.find(m => m.id == accountMilestone.id);
    milestone.claimed = true;
    logger.log('[ACCOUNT MILESTONES SERVICE] claimMilestone', milestone);
  }

}

export const accountMilestonesService = new AccountMilestonesService();
