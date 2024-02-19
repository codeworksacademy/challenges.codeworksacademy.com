// import { Profile } from './Profile'
// import { Challenge } from './Challenge'
import { ChallengeModerator } from "./ChallengeModerator.js"

export class ChallengeParticipant extends ChallengeModerator {
  constructor(data) {
    super(data)
    // this.id = data.id
    // this.challengeId = data.challengeId
    // this.accountId = data.accountId


    // this.status = data.status
    // this.profile = data.profile ? new Profile(data.profile) : {}
    // this.challenge = data.challenge ? new Challenge(data.challenge) : {}
    // this.createdAt = data.createdAt
    // this.updatedAt = data.updatedAt

    this.submission = data.submission
    this.completedAt = data.completedAt
    this.requirements = data.requirements || []
    this.grade = data.grade
  }
}