import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { accountService } from "./AccountService.js"
import { challengesService } from "./ChallengesService.js"
import { participantsService } from "./ParticipantsService.js"

class AnswersService{
  async getMyAnswers(accountId) {
    const answers = await dbContext.Answers.find({ creatorId: accountId })
      .populate('creator')

    return answers
  }

  // Purpose of function is external check to send answers of a challenge to moderators and creators on the front end.
  getAnswersByChallengeId(challengeId) {
    throw new Error('Method not implemented.')
  }
  
  // Purpose of function is internal to check if a user has already submitted an answer before creating a new one. Moderator/Creator checks have been removed for this.
  async getAnswerByChallengeIdForSumbission() {
    const answers = await dbContext.Answers.find({})

    return answers
  }

  async createAnswer(answerData) {

    const userChallenges = await challengesService.getMyChallenges(answerData.creatorId)

    const inChallenge = userChallenges.find(c => c.id == answerData.challengeId)

    if(!inChallenge){
      throw new Forbidden('You are not a participant of this challenge. You cannot submit answers for it.')
    }

    const challenge = await challengesService.getChallengeById(answerData.challengeId)

    if(challenge.isCancelled == true){
      throw new Forbidden('This challenge has been cancelled. You cannot submit answers for it.')
    }

    if(inChallenge){
      const userAnswers = await this.getMyAnswers(answerData.creatorId)

      const existingAnswer = userAnswers.find(a => a.challengeId == answerData.challengeId)

      if(existingAnswer){
        existingAnswer.body = answerData.body || existingAnswer.body

        existingAnswer.save()

        return existingAnswer
      }else{
        const newAnswer = await dbContext.Answers.create(answerData)

        return newAnswer
      }
    }

  }

}

export const answersService = new AnswersService()