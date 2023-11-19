import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"
import { logger } from './../utils/Logger';

class ParticipantsService {

  async getParticipantById(participantId) {
    const res = await api.get(`api/participants/${participantId}`)
    AppState.activeParticipant = res.data
  }

  async joinChallenge(newParticipant) {
    const res = await api.post('api/participants', newParticipant)
    logger.log('New participant:', res.data)
    AppState.participants.push(new ChallengeParticipant(res.data))
  }

  async updateChallengeParticipant(newSubmission, participantId) {
    const res = await api.put(`api/participants/${participantId}`, newSubmission)
    logger.log('Participant Updated ⏩', res.data)
    AppState.activeParticipant = res.data
    return res.data
  }

  async leaveChallenge(participantId) {
    const res = await api.delete(`api/participants/${participantId}`)
    logger.log('Deleted participant:', res.data)
    let participantToRemove = AppState.participants.findIndex(p => p.id === participantId)
    AppState.participants.splice(participantToRemove, 1)
    return res.data
  }

  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    AppState.participants = res.data
    logger.log('[Participants in this challenge]:', AppState.participants)
  }

  // async updateChallengeParticipant(participantId,  newSubmission) {
  //   const res = await api.put('api/participants/' + participantId, newSubmission)
  //   logger.log('Participant Updated ⏩', res.data)
  //   AppState.activeParticipant = res.data
  //   return res.data
  // }
}

export const participantsService = new ParticipantsService()