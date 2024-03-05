import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ChallengeModeratorsController extends BaseController {
  constructor() {
    super('api/moderators')
    this.router
      .get('/:userId/profiles', this.getMyModerationsByProfileId)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.addModerator)
      .get('/challenges/:userId', this.getModerationsByChallengeCreatorId)
      // .put('/:moderatorId', this.ApproveModeration)
      .delete('/:moderatorId', this.removeModerator)
  }

  async getMyModerationsByProfileId(req, res, next) {
    try {
      const profileId = req.params.userId
      const moderations = await challengeModeratorsService.getMyModerationsByProfileId(profileId)
      return res.send(moderations)
    }
    catch (error) { next(error); }
  }

  // 🔽 REQUIRES AUTHENTICATION 🔽

  async addModerator(req, res, next) {
    try {
      const moderatorData = req.body;
      moderatorData.originId = req.userInfo.id;
      const moderation = await challengeModeratorsService.addModerator(moderatorData);
      return res.send(moderation);
    }
    catch (error) { next(error); }
  }

  async getModerationsByChallengeCreatorId(req, res, next) {
    try {
      const userId = req.params.userId
      const moderations = await challengeModeratorsService.getModerationsByChallengeCreatorId(userId)
      return res.send(moderations)
    }
    catch (error) { next(error); }
  }

  // async ApproveModeration(req, res, next) {
  //   try {
  //     const moderatorId = req.params.moderatorId
  //     const userId = req.userInfo.id
  //     const moderatorToApprove = await challengeModeratorsService.ApproveModeration(moderatorId, userId)
  //     return res.send(moderatorToApprove)
  //   }
  //   catch (error) { next(error); }
  // }

  async removeModerator(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const userId = req.userInfo.id
      const moderatorToRemove = await challengeModeratorsService.removeModerator(moderatorId, userId)
      return res.send(moderatorToRemove)
    }
    catch (error) { next(error); }
  }

}