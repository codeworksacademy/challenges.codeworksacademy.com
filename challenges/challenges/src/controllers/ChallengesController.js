import { Auth0Provider } from "@bcwdev/auth0provider";
import { challengesService } from "../services/ChallengesService.js";
import BaseController from "../utils/BaseController.js";

export class ChallengesController extends BaseController {
  constructor() {
    super('api/challenges')
    this.router
      .get('', this.getAllChallenges)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createChallenge)
  }

  async createChallenge(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const challenge = await challengesService.createChallenge(req.body)
      return res.send(challenge)
    } catch (error) {
      next(error)
    }
  }

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
    } catch (error) {
      next(error)
    }

  }
}