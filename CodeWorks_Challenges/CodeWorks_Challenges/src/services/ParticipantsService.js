import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js"

class ParticipantsService {

    async createParticipant(newParticipant) {
        const participant = await dbContext.Participants.create(newParticipant)
        await participant.populate('challenge')
        return participant
    }

    async getParticipant(participantId) {
        const participation = await dbContext.Participants.findById(participantId).populate('challenge')
        if(!participation){
            throw new BadRequest(`There is no participation @ ${participantId}`)
        }
        return participation
    }
    
    async getChallengeParticipants(challengeId) {
        const participants = await dbContext.Participants.find({ challengeId: challengeId }).populate('challenge')
        return participants
    }
    async getMyParticipation(accountId) {
        const participation = await dbContext.Participants.find({ accountId }).populate('challenge')
        return participation
    }

    async deleteParticipant(userId, participantId) {
        const participant = await this.getParticipant(participantId)
        if(participant.accountId != userId){
            throw new BadRequest("This is not your comment")
        }
        await participant.remove()
        return participant
    }
    async getParticipants(challengeId) {
      const participants = await dbContext.Participants.find({ accountId: challengeId}).populate('challenge')
      if(!participants){
        throw new BadRequest("This challenge has no participants.")
      }
      return participants
    }
}

export const participantsService = new ParticipantsService()