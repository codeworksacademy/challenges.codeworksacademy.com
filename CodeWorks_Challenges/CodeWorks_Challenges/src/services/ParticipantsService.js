import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"
import { PROFILE_FIELDS } from '../constants'
import { challengeModeratorsService } from "./ChallengeModeratorsService.js"
import { accountMilestonesService } from "./AccountMilestonesService.js"
import { logger } from "../utils/Logger.js"
import { accountService } from "./AccountService.js"


const EXPERIENCE_SCALE = {
	1: 10,
	2: 50,
	3: 250,
	4: 500,
	5: 1000
}

class ParticipantsService {

	async getParticipantsLeaderboards() {
		const participants = await dbContext.ChallengeParticipants.find({ status: 'completed' }).populate({
			path: 'challenge',
			populate: { path: 'creator requirements participantCount completedCount' }
		}).populate('profile', PROFILE_FIELDS)
		return participants
	}
	
	async getChallengeBadges(participant, accountId) {
		const foundParticipation = await this.getParticipationByUserId(accountId)
		const completedChallenges = foundParticipation.filter(participation => participation.status === 'completed');
		const account = await dbContext.Account.findById(accountId);

		completedChallenges.forEach(completed => {
			if (completed.challenge.badge) {
				account.badges.push(completed.challenge.badge)
			}
		})
		await account.save()
		return account
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

	async getParticipantsByChallengeId(challengeId) {
		const participants = await dbContext.ChallengeParticipants.find({ challengeId })
			.populate({
				path: 'challenge',
				populate: { path: 'creator requirements participantCount completedCount' }
			}).populate('profile', PROFILE_FIELDS)
		// .select('-submission')
		return participants
	}

	async getMyParticipation(accountId) {
		const myParticipation = await dbContext.ChallengeParticipants.find({ accountId }).populate({
			path: 'challenge',
			populate: { path: 'creator' }
		}).populate('profile', PROFILE_FIELDS)
		
		return myParticipation
	}

	async getParticipationByUserId(userId) {
		const participation = await dbContext.ChallengeParticipants.find({ accountId: userId }).populate({
			path: 'challenge',
			populate: { path: 'creator' }
		}).populate('profile', PROFILE_FIELDS)
		return participation
	}

	async getParticipantsByChallengeCreatorId(userId) {

		const challenges = await dbContext.Challenges.find({ creatorId: userId });

		const moderators = await dbContext.ChallengeModerators.find({ challengeId: { $in: challenges } })
			.populate({
				path: 'challenge',
				populate: { path: 'creator participantCount completedCount' }
			})
			.populate('profile', 'name picture');

		return moderators;
	}

	async submitChallenge(participantId, userId, body) {

		let participant = await this.getParticipantById(participantId)

		if (!participant) {
			throw new BadRequest('Invalid participant ID.')
		}
		
		if (userId != participant.accountId) {
			throw new Forbidden("Your information does not match this participant's. You may not submit for other participants.")
		}

		participant.submission = body.submission
		participant.status = body.status
		participant.requirements.map(r => {
			return {
				description: r,
			}
		})
		
		await participant.save()
		
		return participant
	}

	async gradeChallengeParticipant(participantId, graderId, participantGrade) {
		let participant = await this.getParticipantById(participantId)

		if (!participant) {
			throw new BadRequest('Invalid participant ID.')
		}

		const isChallengeModerator = await challengeModeratorsService.getModeratorByUserIdAndChallengeId(graderId, participant.challengeId)

		if (!isChallengeModerator) {
			throw new Forbidden('Yo - bugs bunny - are NOT a moderator for this challenge. You cannot grade participants.')
		}


		participant.grade = participantGrade.grade
		participant.status = participantGrade.status
		participant.requirements = participantGrade.requirements

		await participant.save()

		try {
			accountMilestonesService.giveGradingMilestoneByAccountId(graderId)
			if (participantGrade.status == 'completed') {
				participantGrade.completedAt = new Date()
				this.awardExperience(participant)
			}
		} catch (error) {
			logger.error('[GRADING_HOOK_FAILED]', error)
		}


		return participant
	}


	// This method is used to give the experience of a challenge to a userId
	// Triggered by grading or autoGrade
	async awardExperience(participant) {

		let challenge = participant.challenge
		if (!challenge) {
			challenge = await challengesService.getChallengeById(participant.challengeId)
		}
		participant.experience += EXPERIENCE_SCALE[challenge.difficulty]
		await participant.save()
		await accountService.calculateAccountRank({ id: participant.accountId })
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