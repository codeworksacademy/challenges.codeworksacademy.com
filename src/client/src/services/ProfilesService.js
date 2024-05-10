import { api } from "./AxiosService"
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { Profile } from "../models/Profile.js"
import { Challenge } from "../models/Challenge.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class ProfilesService {
  async getProfiles(name) { // Mod Search Form
    const res = await api.get(`api/profiles?name=${name}`);
    AppState.profiles = res.data.map(p => new Profile(p));
  }
  clearProfiles() { // Mod Search Form
    AppState.profiles = [];
  }

  async getProfileById(profileId) {
    const res = await api.get(`api/profiles/${profileId}`);
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

  clearProfileData() {
    AppState.ProfileState.profile = null;
    AppState.ProfileState.challenges = [];
    AppState.ProfileState.participation = [];
    AppState.ProfileState.milestones = [];
  }

}

export const profilesService = new ProfilesService();