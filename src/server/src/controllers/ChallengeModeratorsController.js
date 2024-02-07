import { challengeModeratorsService } from "../services/ChallengeModeratorsService.js";
import { challengesService } from "../services/ChallengesService.js";
import { participantsService } from "../services/ParticipantsService.js";
import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class ChallengeModeratorsController extends BaseController {
  constructor() {
    super('api/moderators')
    this.router
      .get('/:userId/profiles', this.getMyModerationsByProfileId)

      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createModeration)
      .get('/challenges/:userId', this.getModerationsByChallengeCreatorId)
      // .put('/:participantId/grade', this.gradeChallengeParticipant)
      .put('/:moderatorId', this.ApproveModeration)
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

  // async gradeChallengeParticipant(req, res, next) {
  //   try {
  //     const participantId = req.params.participantId
  //     const userId = req.userInfo.id
  //     const newGrade = req.body
  //     const participant = await challengeModeratorsService.
  //     return res.send(participant)
  //   } catch (error) {
  //     next(error);
  //   }
  // }

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
      const moderatorToRemove = await challengeModeratorsService.removeModerator(moderatorId, userId)
      return res.send(moderatorToRemove)
    } catch (error) {
      next(error);
    }
  }
}