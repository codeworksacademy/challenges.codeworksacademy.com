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

  async updateParticipant(participantId, newParticipant) {
    const res = await api.put(`api/participants/${participantId}`, newParticipant)
    logger.log('Updated participant:', res.data)

    const participant = res.data
    const participantToUpdate = AppState.participants.findIndex(p => p.id === participant.id)
    if (participantToUpdate !== -1) {
      AppState.participants.splice(participantToUpdate, 1, participant)
    }
  }

// //   async updateParticipant(participantId, participantData) {
//     const res = await api.put(`api/participants/${participantId}`, participantData)
//     logger.log('Updated participant:', res.data)

//     // Assuming that the response data contains the updated participant
//     const updatedParticipant = res.data

//     // Find the index of the participant in AppState.participants
//     const participantIndex = AppState.participants.findIndex(p => p.id === participantId)

//     if (participantIndex !== -1) {
//         // Replace the old participant with the updated one
//         AppState.participants.splice(participantIndex, 1, updatedParticipant)
//     }
// }


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