import { dbContext } from "../db/DbContext";
import { BadRequest, Forbidden } from "../utils/Errors";
import { challengesService } from "./ChallengesService";
import { participantsService } from "./ParticipantsService";

class SubmissionsService {
  async createChallengeSubmission(newSubmission) {
    const challenge = await challengesService.getChallengeById(
      newSubmission.challengeId
    );
    if (challenge.isCancelled == true) {
      throw new BadRequest(
        "This challenge has been cancelled. You may not submit a challenge that was cancelled by the creator."
      );
    }
    const participant = await participantsService.getParticipantById(
      newSubmission.participantId
    );
    if (participant.challengeId != newSubmission.challengeId) {
      throw new BadRequest(
        "This participant is not enrolled in this challenge."
      );
    }
    const submission = await dbContext.Submissions.create(newSubmission);
    await submission.populate("participant", "name picture");
    await submission.populate({
      path: "challenge",
      populate: { path: "creator participantCount" },
    });
    return submission;
  }
  async getSubmissionsByChallengeId(challengeId) {
    const submissions = await dbContext.Submissions.find({
      challengeId,
    }).populate({
      path: "challenge",
      populate: { path: "creator participantCount" },
    });
    return submissions;
  }

  async getSubmissionById(participantId) {
    const submission = await dbContext.Submissions.findById(participantId);
    if (!submission) {
      throw new BadRequest("Invalid submission ID.");
    }
    await submission.populate("participant", "name picture");
    await submission.populate({
      path: "challenge",
      populate: { path: "creator participantCount" },
    });
    return submission;
  }

  // async getSubmissionsByParticipantId(participantId) {
  //   const submissions = await dbContext.Submissions.find({
  //     participantId,
  //   }).populate({
  //     path: "challenge",
  //     populate: { path: "creator participantCount" },
  //   })
  //   return submissions;
  // }

  async updateSubmission(submissionId, userId, newSubmission) {
    const submissionToUpdate = await dbContext.Submissions.findById(
      submissionId
    );
    if (!submissionToUpdate) {
      throw new BadRequest("Invalid submission ID.");
    }
    if (userId != submissionToUpdate.participantId) {
      throw new Forbidden(
        "[PERMISSIONS ERROR]: Your information does not match this submission's. You may not edit other submissions."
      );
    }
    const updatedSubmission = await dbContext.Submissions.findByIdAndUpdate(
      submissionId,
      newSubmission,
      { new: true }
    );
    await updatedSubmission.populate("participant", "name picture");
    await updatedSubmission.populate({
      path: "challenge",
      populate: { path: "creator participantCount" },
    });
    return updatedSubmission;

  }
}

export const submissionsService = new SubmissionsService()