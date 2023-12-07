import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ChallengeModeratorsController extends BaseController {
  constructor() {
    super('api/moderators')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createModeration)
      .post('/account', this.createOwnedChallengeModeration)
      .get('/:userId/profiles', this.getMyModerationsByProfileId)
      .get('/challenges/:userId', this.getModerationsByChallengeCreatorId)
      .put('/:moderatorId', this.ApproveModeration)
      .put('/:moderatorId/grade', this.gradeChallenge)
      .delete('/:moderatorId', this.removeModeration)
  }

  async createModeration(req, res, next) {
    try {
      const moderatorData = req.body
      moderatorData.originId = req.userInfo.id
      const moderation = await challengeModeratorsService.createModeration(moderatorData)
      return res.send(moderation)
    } catch (error) {
      next(error);
    }
  }

  async createOwnedChallengeModeration(req, res, next) {
    try {
      const moderatorData = req.body
      moderatorData.status = "active"
      moderatorData.originId = req.userInfo.id
      const moderation = await challengeModeratorsService.createModeration(moderatorData)
      return res.send(moderation)
    } catch (error) {
      next(error);
    }
  }

  async getMyModerationsByProfileId(req, res, next) {
    try {
      const profileId = req.params.userId
      const moderations = await challengeModeratorsService.getMyModerationsByProfileId(profileId)
      return res.send(moderations)
    } catch (error) {
      next(error);
    }
  }

  async getModerationsByChallengeCreatorId(req, res, next) {
    try {
      const userId = req.params.userId
      const moderations = await challengeModeratorsService.getModerationsByChallengeCreatorId(userId)
      return res.send(moderations)
    } catch (error) {
      next(error);
    }
  }

  async gradeChallenge(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const userId = req.userInfo.id
      const newSubmission = req.body
      const participant = await challengeModeratorsService.gradeChallenge(moderatorId, userId, newSubmission)
      return res.send(participant)
    } catch (error) {
      next(error);
    }
  }

  async ApproveModeration(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const userId = req.userInfo.id
      const moderatorToApprove = await challengeModeratorsService.ApproveModeration(moderatorId, userId)
      return res.send(moderatorToApprove)
    } catch (error) {
      next(error);
    }
  }
  async removeModeration(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const userId = req.userInfo.id
      const moderatorToRemove = await challengeModeratorsService.removeModeratoration(moderatorId, userId)
      return res.send(moderatorToRemove)
    } catch (error) {
      next(error);
    }
  }
}