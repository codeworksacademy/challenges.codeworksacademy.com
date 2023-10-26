import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

class ParticipantsService {

	async createParticipant(participantData) {

		const challenge = await challengesService.getChallengeById(participantData.challengeId)

		if (challenge.isCancelled == true) {
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
		const participants = await dbContext.Participants.find({ challengeId }).populate({
			path: 'challenge',
			populate: { path: 'creator participantCount' }
		}).populate('profile', 'name picture')
		return participants
	}

	async getParticipantsByAccount(userId) {
		const participants = await dbContext.Participants.find({ accountId: userId }).populate({
			path: 'challenge',
			populate: { path: 'creator participantCount' }
		})

		return participants
	}

	async updateParticipant(participantId, userId, participantData) {
		const participantToUpdate = await dbContext.Participants.findById(participantId)

		if (!participantToUpdate) {
			throw new BadRequest("Invalid participant ID.")
		}
		if (userId != participantToUpdate.accountId) {
			throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this participant's. You may not edit other participants.")
		}

		const updatedParticipant = await dbContext.Participants.findByIdAndUpdate(participantId, participantData, { new: true })

		await updatedParticipant.populate('profile', 'name picture')
		await updatedParticipant.populate({
			path: 'challenge',
			populate: {
				path: 'creator participantCount'
			}
		})
		
		await updatedParticipant.save()
		return updatedParticipant
	}

	async leaveChallenge(participantId, userId) {
		const participantToRemove = await dbContext.Participants.findById(participantId)

		if (!participantToRemove) {
			throw new BadRequest("Invalid participant ID.")
		}

		if (userId != participantToRemove.accountId) {
			throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this participant's. You may not remove other participants.")
		}

		await participantToRemove.remove()

		return participantToRemove
	}

	async removeParticipant(challengeId, userId, participantData) {
		const challenge = await challengesService.getChallengeById(challengeId)

		const participantToRemove = await dbContext.Participants.findById(participantData.id)

		if (!challenge) {
			throw new BadRequest('Invalid challenge ID.')
		}

		if (!participantToRemove) {
			throw new BadRequest('Invalid participant ID.')
		}

		if (userId != challenge.creatorId) {
			throw new Forbidden(`[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}. You may not remove participants from it.`)
		}

		await participantToRemove.remove()

		return participantToRemove
	}
}

export const participantsService = new ParticipantsService()