import { AppState } from "../AppState"
import { Profile } from "../models/Profile"
import { logger } from "../utils/Logger"
import { api } from "./AxiosService"
import { AccountMilestone } from "../models/AccountMilestone"
import { Challenge } from "../models/Challenge.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class ProfilesService {
  async getProfiles(name) {
    const res = await api.get(`api/profiles/?name=${name}`)
    AppState.ProfileState.profiles = res.data.map(p => new Profile(p))
  }

  async getProfile(profileId) {
    const res = await api.get(`api/profiles/${profileId}`)
    AppState.ProfileState.profile = new Profile(res.data)
    return AppState.ProfileState.profile
  }

  async getChallenges(profileId) {
    const res = await api.get(`api/profiles/${profileId}/challenges`)
    AppState.ProfileState.challenges = res.data.map(m => new Challenge(m))
  }

  async getParticipations(profileId) {
    const res = await api.get(`api/profiles/${profileId}/participations`)
    AppState.ProfileState.participations = res.data.map(m => new ChallengeParticipant(m))
  }
  async getMilestones(profileId) {
    const res = await api.get(`api/profiles/${profileId}/milestones`)
    AppState.ProfileState.milestones = res.data.map(m => new AccountMilestone(m))
  }

  clearProfile() {
    AppState.ProfileState.profile = null
    AppState.ProfileState.challenges = []
    AppState.ProfileState.moderations = []
    AppState.ProfileState.participations = []
    AppState.ProfileState.milestones = []
  }

}

export const profilesService = new ProfilesService()