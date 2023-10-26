import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { accountService } from "./AccountService.js"
import { challengesService } from "./ChallengesService.js"
import { moderatorsService } from "./ModeratorsService.js"
import { participantsService } from "./ParticipantsService.js"

class AnswersService{
  async getMyAnswers(accountId) {
    const answers = await dbContext.Answers.find({ creatorId: accountId })
    .populate({
			path: 'challenge',
			populate: { path: 'creator answerCount' }
		})

    return answers
  }

  async getAnswerById(answerId){
    const answer = dbContext.Answers.findById(answerId).populate({
			path: 'challenge',
			populate: { path: 'creator answerCount' }
		})

    return answer
  }

  // Purpose of function is external check to send answers of a challenge to moderators and creators on the front end. This is not accessible to general users.
  async getAnswersByChallengeId(challengeId, userId) {
    const challenge = await challengesService.getChallengeById(challengeId)

    const challengeModerators = await moderatorsService.getModeratorsByChallengeId(challengeId)

    const isModerator = challengeModerators.find(m => m.accountId == userId)

    if(challenge.creatorId != userId && !isModerator){
      throw new Forbidden('[PERMISSIONS ERROR]: You did not create this challenge and/or are not a moderator of it. You may not access the answers for it.')
    }

    const answers = await dbContext.Answers.find({challengeId: challengeId}).populate({
			path: 'challenge',
			populate: { path: 'creator answerCount' }
		})

    return answers
  }

  async createAnswer(answerData) {

    // Check to see if user is participant in challenge.
    const challengeParticipants = participantsService.getParticipantsByChallengeId(answerData.challengeId)

    const inChallenge = (await challengeParticipants).find(p => p.accountId == answerData.creatorId)

    if(!inChallenge){
      throw new Forbidden('You are not a participant of this challenge. You cannot submit answers for it.')
    }

    const challenge = await challengesService.getChallengeById(answerData.challengeId)

    // Check to ensure challenge hasn't been cancelled
    if(challenge.isCancelled == true){
      throw new Forbidden('This challenge has been cancelled. You cannot submit answers for it.')
    }

    if(inChallenge){
      // Check to see if user has already submitted an answer to the challenge
      const userAnswers = await this.getMyAnswers(answerData.creatorId)

      const existingAnswer = userAnswers.find(a => a.challengeId == answerData.challengeId)

      if(existingAnswer){
        // Edits existing answer to replace previous body data
        existingAnswer.body = answerData.body || existingAnswer.body

        existingAnswer.save()

        return existingAnswer
      }else{
        // Else creates a new answer
        const newAnswer = await dbContext.Answers.create(answerData)

        return newAnswer
      }
    }
  }

  async removeAnswer(userId, answerId) {
    const answerToRemove = await this.getAnswerById(answerId)

    if(!answerToRemove){
      throw new BadRequest('Invalid ID.')
    }

    if(answerToRemove.creatorId != userId){
      throw new Forbidden('[PERMISSIONS ERROR]: You are not the creator of this answer. You may not remove it.')
    }

    await answerToRemove.remove()

    return
  }

}

export const answersService = new AnswersService()