import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { Participant } from "../models/Participant.js"
class ParticipantsService {

  async createParticipant(newParticipant) {
    const res = await api.post('api/participants', newParticipant)
    logger.log('New participant:', res.data)
    AppState.participants.push(new Participant(res.data))
  }

  async leaveChallenge(participantId) {
    const res = await api.delete(`api/participants/${participantId}`)
    logger.log('Deleted participant:', res.data)
    let participantToRemove = AppState.participants.findIndex(p => p.id === participantId)
    AppState.participants.splice(participantToRemove, 1)
  }
  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    AppState.participants = res.data.map(p => new Participant(p))
    logger.log('[Participants in this challenge]:', AppState.participants)
  }
}

export const participantsService = new ParticipantsService()