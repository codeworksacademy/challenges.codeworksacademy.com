import { api } from './AxiosService'
import { AppState } from "../AppState"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"
import { logger } from './../utils/Logger';

class ParticipantsService {

  async getLeaderboards() {
    const res = await api.get('api/participants/leaderboards')
    AppState.ChallengeState.participants = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[PARTICIPANTS LEADERBOARD DATA]:', AppState.ChallengeState.participants)
  }

  async getParticipantById(participantId) {
    const res = await api.get(`api/participants/${participantId}`)
    logger.log('[GETTING PARTICIPANT BY ID]', res.data)
    AppState.ChallengeState.participant = res.data
  }

  async joinChallenge(newParticipant) {
    const res = await api.post('api/participants', newParticipant)
    logger.log('New participant:', res.data)
    AppState.ChallengeState.participants.push(new ChallengeParticipant(res.data))
  }

  async submitAnswer(challengeId, participantId, submission){
    throw new Error('Needs Moved to ChallengesService')
    
    // const res = await api.post(`api/challenges/${challengeId}/participants/${participantId}`, {
    //   challengeId: challengeId,
    //   participantId: participantId,
    //   answer: submission,
    // })
    // if(res.data.participant.status == 'incomplete'){
    //   Pop.error("Answer was incorrect.")
    // }
    // if(res.data.participant.status == 'completed'){
    //   Pop.success("Congratulations on finishing the challenge!")
    // }
  }


  async gradeChallengeParticipant(newGrade) {
    throw new Error('Needs Moved to ChallengesService')
    
    // const res = await api.put(`api/moderators/${newGrade.participantId}/grade`, newGrade)
    // logger.log('Participant Updated ⏩', res.data)
    // AppState.activeParticipant = res.data
    // return res.data
  }

  async leaveChallenge(participantId) {
    const res = await api.delete(`api/participants/${participantId}`)
    logger.log('Deleted participant:', res.data)
    let participantToRemove = AppState.ChallengeState.participants.findIndex(p => p.id === participantId)
    AppState.ChallengeState.participants.splice(participantToRemove, 1)
    return res.data
  }

  async getParticipantsByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/participants`)
    AppState.ChallengeState.participants = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[Participants in this challenge]:', AppState.ChallengeState.participants)
  }

  async getParticipationByUserId(userId){
    const res = await api.get(`api/profiles/${userId}/participants`)

    logger.log('[GETTING PARTICIPATIONS BY USER ID', res.data)

    AppState.ChallengeState.participants = res.data.map(p => new ChallengeParticipant(p))
  }
}

export const participantsService = new ParticipantsService()