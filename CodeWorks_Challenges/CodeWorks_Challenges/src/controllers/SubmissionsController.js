import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider"
import { submissionsService } from "../services/SubmissionsService.js"
import { submittersService } from "../services/SubmittersService.js"
import { challengesService } from "../services/ChallengesService.js"


export class SubmissionsController extends BaseController {
  constructor() {
    super('api/submissions')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createChallengeSubmission)
      .get('/:submissionId', this.getSubmissionById)
      .put('/:submissionId', this.updateSubmission)

      .get('/submitters/:submissionId', this.getSubmitter)
      .get('/submitters/:submissionId/challenges', this.getSubmitterChallenges)
  }

  async createChallengeSubmission(req, res, next) {
    try {
      const newSubmission = req.body
      newSubmission.participantId = req.userInfo.id
      // const submission = await submissionsService.createChallengeSubmission(newSubmission)
      res.send(newSubmission)
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


  async getSubmitters(req, res, next) {
    try {
      const submitters = await submittersService.findSubmitters(req.query.name, req.query.offset)
      res.send(submitters)
    } catch (error) {
      next(error)
    }
  }

  async getSubmitter(req, res, next) {
    try {
      const submitter = await submittersService.getSubmitterById(req.params.id)
      res.send(submitter)
    } catch (error) {
      next(error)
    }
  }

  async getSubmitterChallenges(req, res, next) {
    try {
      const challenges = await challengesService.getSubmitterChallenges(req.params.id)
      return res.send(challenges)
    } catch (error) {
      next(error)
    }
  }
}