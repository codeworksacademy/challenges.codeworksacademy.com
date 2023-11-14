import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider"
import { submissionsService } from "../services/SubmissionsService.js"
import { challengesService } from "../services/ChallengesService.js"
import { participantsService } from "../services/ParticipantsService.js"


export class SubmissionsController extends BaseController {
  constructor() {
    super('api/submissions')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createChallengeSubmission)
      .get('/:submissionId', this.getSubmissionById)
      .put('/:submissionId', this.updateSubmission)
  }

  async createChallengeSubmission(req, res, next) {
    try {
      const newSubmission = req.body
      newSubmission.participantId = req.userInfo.id
      await participantsService.getParticipantById(newSubmission.participantId)
      newSubmission.challengeId = await challengesService.setActiveChallenge(newSubmission.challengeId)
      const submission = await submissionsService.createSubmission(newSubmission)
      res.send(submission)
    } catch (error) {
      next(error)
    }
  }

  async getSubmissionById(req, res, next) {
    try {
      const submissionId = req.params.submissionId
      const submission = await submissionsService.getSubmissionById(submissionId)
      return res.send(submission)
    } catch (error) {
      next(error)
    }
  }

  async updateSubmission(req, res, next) {
    try {
      const submissionId = req.params.submissionId
      const userId = req.userInfo.id
      const newSubmission = req.body

      const updatedSubmission = await submissionsService.updateSubmission(submissionId, userId, newSubmission)
      return res.send(updatedSubmission)
    } catch (error) {
      next(error)
    }
  }
}