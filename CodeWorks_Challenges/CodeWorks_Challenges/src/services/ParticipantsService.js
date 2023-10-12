import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

class ParticipantsService {

    async createParticipant(participantData) {

			const challenge = await challengesService.getChallengeById(participantData.challengeId)

			if(challenge.isCancelled == true){
				throw new BadRequest('This challenge has been cancelled. You may not join a cancelled challenge.')
			}

			const participant = await dbContext.Participants.create(participantData)

			await participant.populate('profile', 'name picture')

			await participant.populate({
				path: 'challenge',
				populate: {
					path: 'creator participantCount'
				}
			})

			return participant
    }

    async getParticipantsByChallengeId(challengeId) {
			const participants = await dbContext.Participants.find({challengeId}).populate('profile', 'name picture')

			return participants
    }

    async getParticipantsByAccount(userId) {
			const participants = await dbContext.Participants.find({accountId: userId}).populate({
				path: 'challenge', 
				populate: {path: 'creator participantCount'}
			})

			return participants
    }

    async removeParticipant(participantId, userId) {
			const participantToRemove = await dbContext.Participants.findById(participantId)

			if (!participantToRemove) {
				throw new BadRequest("Invalid participant ID.")
			}
			
			if (userId != participantToRemove.accountId) {
				throw new BadRequest("Your information does not match this participant's. You may not remove other participants.")
			}

			await participantToRemove.remove()

			return participantToRemove
    }
}

export const participantsService = new ParticipantsService()