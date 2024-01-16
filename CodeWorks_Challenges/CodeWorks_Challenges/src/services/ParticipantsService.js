import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"
import { PROFILE_FIELDS } from '../constants'


class ParticipantsService {

	async getLeaderboards() {
		const participants = await dbContext.ChallengeParticipants.find({ status: 'completed' }).populate({
			path: 'challenge',
			populate: { path: 'creator requirements participantCount completedCount' }
		}).populate('profile', PROFILE_FIELDS)
		return participants
	}

	async joinChallenge(newParticipant) {

		const challenge = await challengesService.getChallengeById(newParticipant.challengeId)

		if (challenge.status != 'published') {
			throw new BadRequest(`[CHALLENGE_STATUS::${challenge.status}] This challenge cannot be joined at this time.`)
		}

		newParticipant.requirements = challenge.requirements.map(r => {
			return {
				description: r,
			}
		})
		const participant = await dbContext.ChallengeParticipants.create(newParticipant)

		return participant
	}

	async getParticipantById(participantId) {
		const participant = await dbContext.ChallengeParticipants.findById(participantId).populate({
			path: 'challenge',
			populate: { path: 'creator requirements participantCount completedCount' }
		}).populate('profile', 'name picture')
		return participant
	}

	// I already know what the challenge is so no need to populate the challenge 
	async getParticipantsByChallengeId(challengeId) {
		const participants = await dbContext.ChallengeParticipants.find({ challengeId })
			.populate('profile', PROFILE_FIELDS)

		return participants
	}

	// I know who I am looking for so no need to populate the profile
	async getParticipationByUserId(userId) {
		const participation = await dbContext.ChallengeParticipants.find({ accountId: userId }).populate({
			path: 'challenge',
			populate: { path: 'creator' }
		})
		return participation
	}

	async leaveChallenge(participantId, userId) {
		const participantToRemove = await dbContext.ChallengeParticipants.findById(participantId)

		if (!participantToRemove) {
			throw new BadRequest("Invalid participant ID.")
		}

		if (userId != participantToRemove.accountId) {
			throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this participant's. You may not remove other participants.")
		}

		participantToRemove.status = 'left'

		await participantToRemove.remove()

		return participantToRemove
	}

	async removeParticipant(challengeId, userId, participant) {
		const challenge = await challengesService.getChallengeById(challengeId)

		const participantToRemove = await dbContext.ChallengeParticipants.findById(participant.id)

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