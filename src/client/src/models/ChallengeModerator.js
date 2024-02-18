import { Profile } from './Profile'
import { Challenge } from './Challenge'

export class ChallengeModerator {
  constructor(data) {
    this.id = data.id
    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.originId = data.originId || null

    this.status = data.status
    this.profile = data.profile ? new Profile(data.profile) : {}
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

  }
}