import BaseController from '../utils/BaseController.js'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { challengesService } from '../services/ChallengesService.js'
import { participantsService } from '../services/ParticipantsService.js'
import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js"

export class ChallengesController extends BaseController {
  constructor() {
    super('api/challenges')
    this.router
      .get('', this.getAllChallenges)
      .get('/:challengeId', this.getChallengeById)
      .get('', this.findChallenges)
      .get('/:challengeId/participants', this.getParticipantsByChallengeId)
      .get('/:challengeId/moderators', this.getModeratorsByChallengeId)

      .use(Auth0Provider.getAuthorizedUserInfo)

      .post('', this.createChallenge)
      .put('/:challengeId', this.editChallenge)
      .put('/:challengeId/reputation', this.giveReputation)
      
      // TODO [🚧 Chantha]
      //FIXME 🛑 Why do two endpoints call the same function? This doesn't serve much purpose
      .post('/:challengeId/answers', this.submitAnswer)
      //   vvv this endpoint doesnt make sense for what is trying to be accomplished
      .put('/:challengeId/participants/:participantId', this.submitAnswer)

      //New route needs to be called /:challengeId/submissions
      

      // .put('/:challengeId', this.deprecateChallenge)
      .put('/:challengeId/grade/:participantId', this.gradeSubmittedChallenge)


      .delete('/:challengeId', this.deleteChallenge)
      .delete('/:challengeId/participants', this.removeParticipant)
  }


  // NOTE this is the method used only by moderators
  async gradeSubmittedChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const participantId = req.params.participantId
      const userId = req.userInfo.id
      // FIXME this needs some work.... expand on this
      // const challenge = await challengesService.submitAnswer(challengeId, userId, answer)
      // return res.send()
      throw new Error('NOT IMPLEMENTED')
    } catch (error) {
      next(error)
    }
  }

  // REVIEW 🟡 This process for submitting a challenge is likely being over complicated or incorrectly handled. When I submit a challenge for grading simply change the status of my participation to NEEDS_GRADED.... 
  // Only need one route, if the challenge is autograde then it will be automatically graded
  // If the challenge is not automatically graded, set the participants status to submitted
  async submitAnswer(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      const answer = req.body
      const result = await challengesService.submitAnswer(challengeId, userId, answer)
      return res.send(result) 
    } catch (e) {
      next(e)
    }
  }

  //#region MANAGE_CHALLENGE_ACTIONS

  async createChallenge(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const challenge = await challengesService.createChallenge(req.body)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async editChallenge(req, res, next) {
    try {
      const newChallenge = req.body
      const userId = req.userInfo.id
      const challengeId = req.params.challengeId
      const challenge = await challengesService.editChallenge(newChallenge, userId, challengeId)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async giveReputation(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id

      const challenge = await challengesService.giveReputation(challengeId, userId)

      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async deprecateChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      await challengesService.deprecateChallenge(challengeId, userId)
      return res.send(challengeId)
    } catch (error) {
      next(error)
    }
  }

  async deleteChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      await challengesService.deleteChallenge(challengeId, userId)
      return res.send(challengeId)
    } catch (error) {
      next(error)
    }
  }

  async removeParticipant(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const newParticipant = req.body
      const userId = req.userInfo.id

      await participantsService.removeParticipant(challengeId, userId, newParticipant)
    } catch (error) {
      next(error)
    }
  }

  //#endregion

  //#region PARTICIPANT_ACTIONS

  async getAllChallenges(req, res, next) {
    try {
      const challenges = await challengesService.getAllChallenges()
      return res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getChallengeById(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const challenge = await challengesService.getChallengeById(challengeId)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async findChallenges(req, res, next) {
    try {
      const challenges = await challengesService.findChallenges(req.query.name, req.query.offset)
      res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getParticipantsByChallengeId(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const participants = await participantsService.getParticipantsByChallengeId(challengeId)

      return res.send(participants)
    } catch (error) {
      next(error)
    }
  }

  async getModeratorsByChallengeId(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const moderators = await challengeModeratorsService.getModeratorsByChallengeId(challengeId)
      return res.send(moderators)
    } catch (error) {
      next(error)
    }
  }

  //#endregion
}