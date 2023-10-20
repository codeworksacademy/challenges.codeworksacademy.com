import { dbContext } from "../db/DbContext.js"
import { BadRequest, Forbidden } from "../utils/Errors.js"
import { challengesService } from "./ChallengesService.js"
import { participantsService } from "./ParticipantsService.js"

class AnswersService{

  // Purpose of function is external check to send answers of a challenge to moderators and creators.
  getAnswersByChallengeId(challengeId) {
    throw new Error('Method not implemented.')
  }
  
  // Purpose of function is internal to check if a user has already submitted an answer before creating a new one. Moderator/Creator checks have been removed for this.
  async getAnswersByChallengeIdForSumbission(challengeId) {
    const answers = await dbContext.Answers.find({challengeId: challengeId})

    return answers
  }
  async createAnswer(answerData) {

    const challenge = await challengesService.getChallengeById(answerData.challengeId)

    if(!challenge){
      throw new BadRequest('Invalid Challenge ID.')
    }

    if(challenge.isCancelled == true){
      throw new Forbidden('This challenge has been cancelled. You cannot submit answers for it.')
    }

    const participants = await participantsService.getParticipantsByChallengeId(answerData.challengeId)

    const participant = participants.find(p => p.accountId == answerData.creatorId)

    if(!participant){
      throw new Forbidden('[PERMISSIONS ERROR]:You are not a participant for this challenge. You cannot submit answers to a challenge you have not joined.')
    }

    if(participant){
      const challengeAnswers = await this.getAnswersByChallengeIdForSumbission(answerData.challengeId)

      const participantAnswer = challengeAnswers.find({ answerData.creatorId })

      if(!participantAnswer){
        const answer = await dbContext.Answers.create(answerData)

        return answer
      } else{

      }
    }


  }

}

export const answersService = new AnswersService()