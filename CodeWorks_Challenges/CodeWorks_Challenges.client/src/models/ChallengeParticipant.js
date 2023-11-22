import { Challenge } from './Challenge'
import { Profile } from './Profile'

export class ChallengeParticipant {
  constructor(data) {
    this.id = data.id
    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.submission = data.submission
    this.status = data.status
    this.profile = data.profile ? new Profile(data.profile) : {}
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.requirements = data.requirements || []
    this.challenge = data.challenge ? new Challenge(data.challenge) : {}
  }
}