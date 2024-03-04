import { ChallengeModerator } from "./ChallengeModerator.js"

export class ChallengeParticipant extends ChallengeModerator {
  constructor(data) {
    super(data)
    // this.id = data.id
    // this.createdAt = data.createdAt
    // this.updatedAt = data.updatedAt

    // this.challengeId = data.challengeId
    // this.accountId = data.accountId
    // this.originId = data.originId || null

    // this.profile = data.profile ? new Profile(data.profile) : {}
    // this.challenge = data.challenge ? new Challenge(data.challenge) : null
    // this.status = data.status

    this.submission = data.submission
    this.completedAt = data.completedAt
    this.requirements = data.requirements || []
    this.feedback = data.feedback
    this.grade = data.grade
  }
}