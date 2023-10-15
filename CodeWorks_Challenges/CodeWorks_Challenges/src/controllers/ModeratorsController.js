import { moderatorsService } from "../services/ModeratorsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ModeratorsController extends BaseController {
  constructor() {
    super('api/moderators')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createModeration)
      .get('/:userId/profiles', this.getMyModerationsByProfileId)
      .delete('/:moderatorId', this.removeModeration)
  }

  async createModeration(req, res, next) {
    try {
      const moderatorData = req.body
      // moderatorData.accountId = req.userInfo.id

      const moderation = await moderatorsService.createModeration(moderatorData)
      return res.send()
    } catch (error) {
      next(error);
    }
  }

  async getMyModerationsByProfileId(req, res, next) {
    try {
      const profileId = req.params.userId
      const moderations = await moderatorsService.getMyModerationsByProfileId(profileId)
      return res.send(moderations)
    } catch (error) {
      next(error);
    }
  }
  async removeModeration(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const userId = req.userInfo.id
      const moderatorToRemove = await moderatorsService.removeModeratoration(moderatorId, userId)
      return res.send(moderatorToRemove)
    } catch (error) {
      next(error);
    }
  }
}