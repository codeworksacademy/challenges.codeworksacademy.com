import { AppState } from "../AppState"
import { Profile } from "../models/Profile"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"
import { AccountMilestone } from "../models/AccountMilestone"
import { Challenge } from "../models/Challenge.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class ProfilesService {
  async getProfiles(name) {
    const res = await api.get(`api/profiles?name=${name}`)
    AppState.profiles = res.data.map(p => new Profile(p))
    
  }

  async getProfile(profileId) {
    const res = await api.get(`api/profiles/${profileId}`)
    const profile = new Profile(res.data);
    // profile.rank = res.data.rank;
    // profile.reputation = res.data.reputation;
    AppState.ProfileState.profile = profile;
    return profile;
  }

  async getProfileData() {
    try {
      await Promise.all([
        this.getProfileChallenges(),
        this.getParticipation(),
        this.calculateProfileRank(),
        this.calculateProfileReputation()
      ])
    } catch (error) {
      // todo figure out repeat calls
      logger.error(error)
    }
  }

  async getChallenges(profileId) {
    const res = await api.get(`api/profiles/${profileId}/challenges`)
    AppState.ProfileState.challenges = res.data.map(m => new Challenge(m))
  }

  async getParticipation(profileId) {
    const res = await api.get(`api/profiles/${profileId}/participation`)
    AppState.ProfileState.participation = res.data.map(m => new ChallengeParticipant(m))
  }

  async calculateProfileRank(profileId) {
    const res = await api.get(`api/profiles/${profileId}/rank`)
    logger.log('[CURRENT PROFILE RANK]', res.data)
    AppState.ProfileState.profile.rank = res.data.rank
    return res.data
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
    AppState.ProfileState.profile = null
    AppState.ProfileState.challenges = []
    AppState.ProfileState.moderations = []
    AppState.ProfileState.participation = []
    AppState.ProfileState.milestones = []
  }

}

export const profilesService = new ProfilesService()