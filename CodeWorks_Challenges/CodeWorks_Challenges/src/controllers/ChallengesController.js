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
      .get('/:challengeName/search', this.findChallengesByQuery)
      .get('/:challengeId/participants', this.getParticipantsByChallengeId)
      .get('/:challengeId/moderators', this.getModeratorsByChallengeId)

      .use(Auth0Provider.getAuthorizedUserInfo)

      .post('', this.createChallenge)
      .put('/:challengeId', this.editChallenge)
      .put('/:challengeId/reputation', this.giveReputation)
      .put('/:challengeId/submit', this.submitChallenge)
      
      .put('/:challengeId/participants/:participantId', this.gradeParticipant)
      // .delete('/:challengeId', this.deleteChallenge)
      .delete('/:challengeId/participants', this.removeParticipant)
  }

  async submitChallenge(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const userId = req.userInfo.id
      const submissionData = req.body
      const result = await challengesService.submitChallenge(challengeId, userId, submissionData)
      return res.send(result)
    } catch (e) {
      next(e)
    }
  }

  //#region MANAGE_CHALLENGE_ACTIONS

  async createChallenge(req, res, next) {
    try {
      const challengeData = req.body
      challengeData.creatorId = req.userInfo.id

      const challenge = await challengesService.createChallenge(challengeData)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

  async editChallenge(req, res, next) {
    try {
      const challengeData = req.body
      const userId = req.userInfo.id
      const challengeId = req.params.challengeId

      const challenge = await challengesService.editChallenge(challengeData, userId, challengeId)
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

  // 🚨Is not connected to controller routing
  // async deprecateChallenge(req, res, next) { //No Reference
  //   try {
  //     const challengeId = req.params.challengeId
  //     const userId = req.userInfo.id
  //     await challengesService.deprecateChallenge(challengeId, userId)
  //     return res.send(challengeId)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  // async deleteChallenge(req, res, next) {
  //   try {
  //     const challengeId = req.params.challengeId
  //     const userId = req.userInfo.id

  //     await challengesService.deleteChallenge(challengeId, userId)
  //     return res.send(challengeId)
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  async removeParticipant(req, res, next) {
    try {
      const challengeId = req.params.challengeId
      const participant = req.body
      const userId = req.userInfo.id

      await participantsService.removeParticipant(challengeId, userId, participant)
    } catch (error) {
      next(error)
    }
  }

  async gradeParticipant(req, res, next) {
    try{
      const challengeId = req.params.challengeId
      const participantId = req.params.participantId
      const grade = req.body.grade
      const userId = req.userInfo.id

      const participant = await challengesService.gradeParticipant(challengeId, participantId, grade, userId)
      return res.send(participant)
    }catch(e){
      next(e)
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

  async findChallengesByQuery(req, res, next) { //⚠️ -- This works but does not return creator $lookup is broken (I don't know how to use it)
    try {
      const name = req.params.challengeName
      const offset = 0

      const challenges = await challengesService.findChallengesByQuery(name, offset)
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