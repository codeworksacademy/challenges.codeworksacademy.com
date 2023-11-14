import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { Participant } from "../models/Participant.js"
class ParticipantsService {

  async joinChallenge(newParticipant) {
    const res = await api.post('api/participants', newParticipant)
    logger.log('New participant:', res.data)
    AppState.participants.push(new Participant(res.data))
  }

  async submitChallengeForGrading(newParticipant) {
    const res = await api.put(`api/participants/${participantId}`, newParticipant)
    logger.log('Updated participant:', res.data)
    const participant = res.data
    const participantToUpdate = AppState.participants.findIndex(p => p.id === participant.id)
    //FIXME - JAKE - Is the if statement necessary? I was thinking as a safety check...but if not it can be removed! - AJ
    if (participantToUpdate !== -1) {
      AppState.participants.splice(participantToUpdate, 1, participant)
    }
    return res.data
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

  // async submitChallengeForGrading(participantId,  newSubmission) {
  //   const res = await api.put('api/participants/' + participantId, newSubmission)
  //   logger.log('Participant Updated ⏩', res.data)
  //   AppState.activeParticipant = res.data
  //   return res.data
  // }
}

export const participantsService = new ParticipantsService()