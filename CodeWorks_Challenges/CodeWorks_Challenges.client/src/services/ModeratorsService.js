import { api } from './AxiosService'
import { AppState } from "../AppState.js"
import { logger } from "../utils/Logger.js"
import { Participant } from "../models/Participant.js"
class ModeratorsService {
  // TODO 
  // Create a moderator one to one moderator Id - challenge Id
  // Delete a moderator - as the moderator and as the challenge owner
  // Moderator must recieve approval 
  // From owner to user - by user
  // From user to owner - by owner

  // async createParticipant(newParticipant) {
  //   const res = await api.post('api/participants', newParticipant)
  //   logger.log('New participant:', res.data)
  //   AppState.participants.push(new Participant(res.data))
  // }

  // async leaveChallenge(participantId) {
  //   const res = await api.delete(`api/participants/${participantId}`)
  //   logger.log('Deleted participant:', res.data)
  //   let participantToRemove = AppState.participants.findIndex(p => p.id === participantId)
  //   AppState.participants.splice(participantToRemove, 1)
  // }
}

export const moderatorsService = new ModeratorsService()