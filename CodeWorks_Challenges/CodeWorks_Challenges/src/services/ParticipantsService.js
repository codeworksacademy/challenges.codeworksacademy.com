import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js"

class ParticipantsService {

    async createParticipant(newParticipant) {
        const participant = await dbContext.Participants.create(newParticipant)
        await participant.populate('challenge')
        await participant.populate('profile', 'name picture')
        return participant
    }

    async getParticipantsOfChallenge(challengeId) {
        const participants = await dbContext.Participants.find({challengeId}).populate('profile', 'name picture')
        return participants
    }

    async getParticipantsByAccount(userId) {
        const participants = await dbContext.Participants.find({accountId: userId}).populate({path: 'challenge', populate: {path: 'creator participantCount'}})
        return participants
    }

    async removeParticipant(participantId, userId) {
        const participant = await dbContext.Participants.findById(participantId).populate('challenge profile')

        if (!participant) throw new BadRequest("Invalid participant")
        
        if (userId != participant.accountId) throw new BadRequest("You are not currently a participant")

        await participant.remove()

        // @ts-ignore
        return `Successfully removed participant ${participant.profile.name} from ${participant.challenge.name}`
    }
}

export const participantsService = new ParticipantsService()