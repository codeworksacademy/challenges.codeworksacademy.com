import { api } from "./AxiosService"
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { Profile } from "../models/Profile.js"
import { Challenge } from "../models/Challenge.js"
import { AccountMilestone } from "../models/AccountMilestone.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class ProfilesService {
  async getProfiles(name) { // Mod Search Form
    const res = await api.get(`api/profiles?name=${name}`);
    AppState.profiles = res.data.map(p => new Profile(p));
  }

  async getProfileById(profileId) {
    const res = await api.get(`api/profiles/${profileId}`)
    AppState.ProfileState.profile = new Profile(res.data);
  }

  async getChallenges(profileId) {
    const res = await api.get(`api/profiles/${profileId}/challenges`);
    AppState.ProfileState.challenges = res.data.map(m => new Challenge(m));
  }

  async getParticipation(profileId) {
    const res = await api.get(`api/profiles/${profileId}/participation`);
    AppState.ProfileState.participation = res.data.map(m => new ChallengeParticipant(m));
  }

  async calculateProfileRank(profileId) {
    const res = await api.get(`api/profiles/${profileId}/rank`);
    logger.log('[CURRENT PROFILE RANK]', res.data);
    AppState.ProfileState.profile.rank = res.data.rank;
    return res.data;
  }

  async calculateProfileReputation(profileId) {
    const res = await api.get(`api/profiles/${profileId}/reputation`)
    AppState.ProfileState.profile.reputation = res.data.reputation
    return res.data
  }
  async getMilestones(profileId) {
    const res = await api.get(`api/profiles/${profileId}/milestones`)
    AppState.ProfileState.milestones = res.data.map(m => new AccountMilestone(m))
  }

  clearProfile() {
    AppState.ProfileState.profile = null;
    AppState.ProfileState.challenges = [];
    AppState.ProfileState.participation = [];
    AppState.ProfileState.milestones = [];
  }

  sideLoadAccountInfo(profileId) { // when profile page is your own account
    logger.log('[PROFILE SERVICE] Load ProfileState <- AccountState');
    AppState.ProfileState.profile = AppState.AccountState.account
      ? new Profile(AppState.AccountState.account)
      : getProfileById(profileId);
    AppState.ProfileState.challenges = [...AppState.AccountState.challenges]
      ?? getChallenges(profileId);
    AppState.ProfileState.participation = [...AppState.AccountState.participation]
      ?? getParticipation(profileId);
    AppState.ProfileState.milestones = [...AppState.AccountState.milestones]
      ?? getMilestones(profileId);
  }

}

export const profilesService = new ProfilesService()