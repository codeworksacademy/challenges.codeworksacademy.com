import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider"
import { submissionsService } from "../services/SubmissionsService.js"


export class SubmissionsController extends BaseController {
  constructor() {
    super('api/submissions')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.submitChallengeToBeGraded)
      .put('/:submissionId', this.updateSubmission)
  }

  async submitChallengeToBeGraded(req, res, next) {
    try {
      const submissionData = req.body
      submissionData.creatorId = req.userInfo.id
      const submission = await submissionsService.submitChallengeToBeGraded(submissionData)
      res.send(submission)
    } catch (error) {
      next(error)
    }
  }

  async updateSubmission(req, res, next) {
    try {
      const submissionId = req.params.submissionId
      const userId = req.userInfo.id
      const submissionData = req.body

      const updatedSubmission = await submissionsService.updateSubmission(submissionId, userId, submissionData)
      return res.send(updatedSubmission)
    } catch (error) {
      next(error)
    }
  }
}