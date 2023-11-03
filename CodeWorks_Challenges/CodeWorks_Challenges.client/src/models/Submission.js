import { Participant } from './Participant'
import { Challenge } from './Challenge'
import { DateTime } from '../utils/DateTime'

export class Submission {
  constructor(data) {
    this.id = data.id
    this.participantId = data.participantId
    this.challengeId = data.challengeId
    this.supportLinks = data.supportLinks
    this.isSubmitted = data.isSubmitted
    this.participant = data.participant ? new Participant(data.participant) : null
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.submittedAt = DateTime(data.submittedAt)
  }
}

export class SubmissionCreate {
  constructor(data) {
    this.participantId = data.participantId
    this.challengeId = data.challengeId
    this.supportLinks = data.supportLinks
    this.isSubmitted = data.isSubmitted
  }
}
//The above class is so that we can create a submission without the id, which is created by the database. this is used in the submissions service to create a submission so that we can get the id back from the database and set it to the active submission in the appstate like so:
// const submission = await submissionsService.createSubmission(newSubmission)
// AppState.activeSubmission = submission
// return submission
//This is used in the SubmissionsController to create a submission:
// async createChallengeSubmission(req, res, next) {
//   try {
//     const newSubmission = req.body
//     newSubmission.participantId = req.userInfo.id
//     newSubmission.challengeId = await challengesService.setActiveChallenge(newSubmission.challengeId)
//     const submission = await submissionsService.createChallengeSubmission(newSubmission)
//     res.send(newSubmission)
//   } catch (error) {
//     next(error)
//   }
// }
//This is used in the SubmissionsService to create a submission:
// async createChallengeSubmission(newSubmission) {
//   const challenge = await challengesService.setActiveChallenge(
//     newSubmission.challengeId
//   );
//   if (challenge.isCancelled == true) {
//     throw new BadRequest(
//       "This challenge has been cancelled. You may not submit a challenge that was cancelled by the creator."
//     );
//   }
//   const participant = await participantsService.getParticipantById(
//     newSubmission.participantId
//   );
//   if (participant.challengeId != newSubmission.challengeId) {
//     throw new BadRequest(
//       "This participant is not enrolled in this challenge."
//     );
//   }
//   const submission = await dbContext.Submissions.create(newSubmission);
//   await submission.populate("participant", "name picture");
//   await submission.populate({
//     path: "challenge",
//     populate: { path: "creator participantCount" },
//   });
//   return submission;
// }
//This is used in the SubmissionsService to get the submissions by challenge id:
// async getSubmissionsByChallengeId(challengeId) {
//   const submissions = await dbContext.Submissions.find({
//     challengeId,
//   }).populate({
//     path: "challenge",
//     populate: { path: "creator participantCount" },
//   });
//   return submissions;
// }
//This is how we would bring it into the frontend:
// import { api } from './AxiosService'
// import { AppState } from '../AppState'
// import { logger } from '../utils/Logger'
// import { Submission } from '../models/Submission'
// import { Challenge } from '../models/Challenge'
// import { challengesService } from './ChallengesService'
//
// class SubmissionsService {
//   async createSubmission(newSubmission) {
//     const res = await api.post('/api/submissions', newSubmission)
//     logger.log('Creating Submission ⏩', res.data)
//     AppState.activeSubmission = res.data
//     return res.data
//   }
// }
//
// export const submissionsService = new SubmissionsService()
//This is how we would get the submissions by challenge id:
// async getSubmissionsByChallengeId(challengeId) {
//   const res = await api.get(`/api/challenges/${challengeId}/submissions`)
//   logger.log('Getting Submissions By Challenge Id ⏩', res.data)
//   AppState.submissions = res.data.map(s => new Submission(s))
// }
//If we are getting a null error reading challengeId, then we need to make sure that we are setting the active challenge in the challenges service:
// async setActiveChallenge(challengeId) {
//   const challenge = await api.get(`/api/challenges/${challengeId}`)
//   logger.log('Setting Active Challenge ⏩', challenge.data)
//   AppState.activeChallenge = new Challenge(challenge.data)
//   return challenge.data.id
// }
