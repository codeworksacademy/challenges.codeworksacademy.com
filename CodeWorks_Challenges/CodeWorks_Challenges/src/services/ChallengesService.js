import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { participantsService } from "./ParticipantsService.js";

class ChallengesService {
  
  async createChallenge(newChallenge) {
    const challenge = await dbContext.Challenges.create(newChallenge)
    await challenge.populate('creator')
    return challenge
  }
  
  async getMyChallenges(accountId) {
    const myChallenges = await dbContext.Challenges.find({ creatorId: accountId })
    .populate('creator')
    return myChallenges
  }
  
  async getAllChallenges() {
    const challenges = await dbContext.Challenges.find().populate('creator')
    .sort({ createdAt: -1 })
    return challenges
  }
  
  async getChallengeById(challengeId){
    const challenge = await dbContext.Challenges.findById(challengeId)
    .populate('creator', 'name picture')
    
    if(!challenge){
      throw new BadRequest('Invalid Challenge ID.')
    }
    
    return challenge
  }
  
  // TO DO: Add challenges that a user has joined and completed
  async getProfileChallenges(profileId) {
    const challenges = await dbContext.Challenges.find({creatorId: profileId}).populate('creator')
    
    if(!challenges){
      throw new BadRequest('This profile has not created any challenges yet.')
    }
    
    return challenges
  }
  
  async setActiveChallenge(challengeId) {
    const challenge = await dbContext.Challenges.findById(challengeId)
    .populate('creator', 'name picture')
    if (!challenge) {
      throw new BadRequest("Invalid Challenge ID.")
    }
    return challenge
  }
  
  async editChallenge(newChallenge, userId, challengeId) {
    const challenge = await this.setActiveChallenge(challengeId)
    if (challenge.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: Only the creator of ${challenge.name} can edit it.`
        )
      }
      
      challenge.name = newChallenge.name || challenge.name
      challenge.description = newChallenge.description || challenge.description
      challenge.steps = newChallenge.steps || challenge.steps
      challenge.coverImg = newChallenge.coverImg || challenge.coverImg
      challenge.supportLinks = newChallenge.supportLinks || challenge.supportLinks
      challenge.difficulty = newChallenge.difficulty || challenge.difficulty
      challenge.pointValue = newChallenge.pointValue || challenge.pointValue
      challenge.answers = newChallenge.answers || challenge.answers
      challenge.isCancelled = newChallenge.isCancelled || challenge.isCancelled
      
      await challenge.save()
      return challenge
    }
    
    async cancelChallenge(challengeId, userId) {
      const challenge = await this.setActiveChallenge(challengeId)
      if (challenge.creatorId != userId) {
        throw new Forbidden(
          `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot cancel it.`
          )
        }
        challenge.isCancelled = !challenge.isCancelled
        await challenge.save()
        return challenge
      }
      
      async deleteChallenge(challengeId, userId) {
        const challenge = await this.setActiveChallenge(challengeId)
        if (challenge.creatorId != userId)
        throw new Forbidden(
      `[PERMISSIONS ERROR]: You are not the creator of ${challenge.name}, therefore you cannot delete it.`
      )
      challenge.remove()
      return challenge
    }
    
      async submitAnswer(challengeId, userId, answer) {
        const challenge = await this.getChallengeById(challengeId)
        if(challenge.answers[0] === answer.answer){
          return 'You are correct!'
        } else {
          return `${answer.answer} is incorrect!`
        }
        // return `${challenge.answers}, Answer: ${answer.answer}`;
      }
  }
  
  export const challengesService = new ChallengesService()