import { AppState } from "../AppState.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { logger } from "../utils/Logger.js"
import { api } from "./AxiosService.js"

class AccountMilestonesService {

  async getAccountMilestonesByUserId(profileId) {
    const res = await api.get(`api/profiles/${profileId}/milestones`);
    AppState.ProfileState.milestones = res.data.map(m => new AccountMilestone(m));
    if (AppState.AccountState.account.id == AppState.ProfileState.profile?.id) {
      AppState.AccountState.milestones = [...AppState.ProfileState.milestones];
    }
  }

  async claimMilestone(accountMilestoneId) {
    const res = await api.put(`api/accountMilestones/claimMilestone/${accountMilestoneId}`);
    const milestone = AppState.AccountState.milestones?.find(m => m.id == accountMilestoneId);
    milestone.claimed = true;
    logger.log('[ACCOUNT MILESTONES SERVICE] claimMilestone', milestone);
  }

}

export const accountMilestonesService = new AccountMilestonesService();
