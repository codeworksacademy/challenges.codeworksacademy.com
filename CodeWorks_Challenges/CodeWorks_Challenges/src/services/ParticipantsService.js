import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"

const PROFILE_FIELDS = 'name picture reputation title';

class ParticipantsService {
	async getChallengeRewards(accountId) {
		const rewards = await dbContext.Participants.find({ accountId, status: 'completed' })
			.populate('challenge', 'name badgeImg')
			.select('-submission')
		return rewards
	}

	async joinChallenge(participantData) {

		const challenge = await challengesService.getChallengeById(participantData.challengeId)

		if (challenge.status != 'published') {
			throw new BadRequest(`[CHALLENGE_STATE::${challenge.status}] This challenge cannot be joined at this time.`)
		}

		const participant = await dbContext.Participants.create(participantData)

		// REVIEW PROBABLY UNNECESSARY this can be handled purely on the client 
		// subsequent requests for the data will include newly joined participant 
		// await participant.populate('profile', 'name picture')
		// await participant.populate({
		// 	path: 'challenge',
		// 	populate: {
		// 		path: 'creator participantCount'
		// 	}
		// })

		return participant
	}

	async getParticipantById(participantId) {
		const participant = await dbContext.Participants.findById(participantId).populate({
			path: 'challenge',
			populate: { path: 'creator participantCount' }
		}).populate('profile', 'name picture')
		return participant
	}

	async getParticipantsByChallengeId(challengeId) {
		const participants = await dbContext.Participants.find({ challengeId })
			.populate('profile', PROFILE_FIELDS)
			.select('-submission')
		return participants
	}

	async getMyParticipations(accountId) {
		const participants = await dbContext.Participants.find({ accountId }).populate({
			path: 'challenge',
			populate: { path: 'creator' }
		}).populate('profile', PROFILE_FIELDS)
		return participants
	}

	async submitChallengeForGrading(participantId, userId, participantData) {
		const participantToUpdate = await dbContext.Participants.findById(participantId)

		if (!participantToUpdate) {
			throw new BadRequest("Invalid participant ID.")
		}
		if (userId != participantToUpdate.accountId) {
			throw new Forbidden("[PERMISSIONS ERROR]: Your information does not match this participant's. You may not edit other participants.")
		}

		participantToUpdate.submission = participantData.submission
		if (participantToUpdate.status != 'completed') {
			participantToUpdate.status = 'submitted'
		}

		// TODO trigger autograder if possible

		await participantToUpdate.save()
		return participantToUpdate
	}

	async gradeChallenge(submission, graderAccountId) {
		// TODO write this, ensure grader is creator or moderator
	}

	async acknowledgeReward(id, accountId) {
		// TODO write this
		const participant = await dbContext.Participants.findOne({ _id: id, accountId })
		if (!participant || participant.status != 'completed' || participant.claimedAt) {
			throw new BadRequest('Unable to claim badge')
		}
		participant.claimedAt = new Date()
		await participant.save()
		return participant
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