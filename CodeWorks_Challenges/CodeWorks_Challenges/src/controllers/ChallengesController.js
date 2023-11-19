import BaseController from '../utils/BaseController.js'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { challengesService } from '../services/ChallengesService.js'
import { participantsService } from '../services/ParticipantsService.js'
import { moderatorsService } from "../services/ModeratorsService.js"
import { submissionsService } from '../services/SubmissionsService.js'

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
      .post('/:challengeId/answers', this.submitAnswer)
      // .put('/:challengeId', this.deprecateChallenge)
      .put('/:challengeId/participants/:participantId', this.submitAnswer)
      .put('/:challengeId/grade/:participantId', this.gradeSubmittedChallenge)
      .delete('/:challengeId', this.deleteChallenge)
      .delete('/:challengeId/participants', this.removeParticipant)

      // .get('/:challengeId/submissions', this.getSubmissionsByChallengeId)
  }

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

  async submitAnswer(req, res, next){
    try{
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      const answer = req.body
      const result = await challengesService.submitAnswer(challengeId, userId, answer)
      return res.send(result) //FIXME - Working on this
    } catch (e){
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

  // FIXME important to remember delete requests do not include a body
  async removeParticipant(req, res, next) {
    try {
      // const challengeId = req.params.challengeId

      // const newParticipant = req.body

      // const userId = req.userInfo.id

      // await participantsService.removeParticipant(challengeId, userId, newParticipant)
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
      const moderators = await moderatorsService.getModeratorsByChallengeId(challengeId)
      return res.send(moderators)
    } catch (error) {
      next(error)
    }
  }

  //#endregion
}