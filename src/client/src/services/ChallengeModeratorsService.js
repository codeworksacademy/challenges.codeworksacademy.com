import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { ChallengeModerator } from "../models/ChallengeModerator"
class ChallengeModeratorsService {

  async addModerator(moderatorData) {
    const res = await api.post('api/moderators', moderatorData);
    const newMod = new ChallengeModerator(res.data);
    AppState.ChallengeState.moderators.push(newMod);
  }

  async getModerationsByProfileId(userId) {
    const res = await api.get(`api/moderators/${userId}/profiles`);
    AppState.ChallengeState.moderators = res.data.map(m => new ChallengeModerator(m));
  }

  async getModeratorsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/moderators`);
    AppState.ChallengeState.moderators = res.data.map(m => new ChallengeModerator(m));
  }

  async getModerationsByChallengeCreatorId(userId) {
    const res = await api.get(`api/moderators/challenges/${userId}`);
    AppState.ChallengeState.moderators = res.data.map(m => new ChallengeModerator(m));
  }

  async removeModerationRole(moderationId) {
    const res = await api.delete(`api/moderators/${moderationId}`)

    // Remove moderation from challenge render
    let moderatorToRemove = AppState.ChallengeState.moderators.findIndex(m => m.id == moderationId);
    if (moderatorToRemove != -1) {
      AppState.ChallengeState.moderators.splice(moderatorToRemove, 1);
    }

    // Remove moderation from account data render
    let myModerationToRemove = AppState.AccountState.moderation.findIndex(m => m.id == moderationId);
    if (myModerationToRemove != -1) {
      AppState.AccountState.moderation.splice(myModerationToRemove, 1);
    }
  }
}

export const challengeModeratorsService = new ChallengeModeratorsService();