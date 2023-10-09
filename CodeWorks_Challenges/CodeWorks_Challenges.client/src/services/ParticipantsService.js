import { api } from './AxiosService'
import { accountService } from './AccountService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
class ParticipantsService {

  async createParticipant(newParticipant) {
    const res = await api.post('api/participants', newParticipant)
    await accountService.getMyParticipants()
    AppState.participants.push(res.data)
    logger.log('Now participating in active challenge with id:', res.data)
  }

  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    AppState.participants = res.data
    logger.log('Participants in this challenge:', AppState.participants)
  }

  async deleteParticipant(participantId) {
    const res = await api.delete(`api/participants/${participantId}`)
    logger.log('Deleted participant:', res.data)
    AppState.participants = AppState.participants.filter(p => p.id !== participantId)
    return res.data
  }
}

export const participantsService = new ParticipantsService()