import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ChallengeModeratorsController extends BaseController {
  constructor() {
    super('api/moderators')
    this.router
      .get('/:accountId/profiles', this.getMyModerationsByProfileId)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.addModerator)
      .get('/challenges/:accountId', this.getModerationsByChallengeCreatorId)
      // .put('/:moderatorId', this.ApproveModeration)
      .delete('/:moderatorId', this.removeModerator)
  }

  async getMyModerationsByProfileId(req, res, next) {
    try {
      const profileId = req.params.accountId
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
      const accountId = req.params.accountId
      const moderations = await challengeModeratorsService.getModerationsByChallengeCreatorId(accountId)
      return res.send(moderations)
    }
    catch (error) { next(error); }
  }

  // async ApproveModeration(req, res, next) {
  //   try {
  //     const moderatorId = req.params.moderatorId
  //     const accountId = req.userInfo.id
  //     const moderatorToApprove = await challengeModeratorsService.ApproveModeration(moderatorId, accountId)
  //     return res.send(moderatorToApprove)
  //   }
  //   catch (error) { next(error); }
  // }

  async removeModerator(req, res, next) {
    try {
      const moderatorId = req.params.moderatorId
      const accountId = req.userInfo.id
      const moderatorToRemove = await challengeModeratorsService.removeModerator(moderatorId, accountId)
      return res.send(moderatorToRemove)
    }
    catch (error) { next(error); }
  }

}