import { AppState } from "../AppState.js";
import { logger } from "../utils/Logger.js";
import { api } from "./AxiosService.js";

class ParticipantsService {

  async getParticipants(challengeId) {
    const res = await api.get(`/challenges/${challengeId}/participants`)
    AppState.participants = res.data
    const challenge = AppState.challenges.find(c => c.id === challengeId)
    logger.log(`Participants for ${challenge.name}:`, AppState.participants)
  }
}

export const participantsService = new ParticipantsService();