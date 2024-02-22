import { Profile } from './Profile.js'
import { Challenge } from './Challenge.js'

export class ChallengeModerator {
  constructor(data) {
    this.id = data.id
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt

    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.originId = data.originId || null

    this.profile = data.profile ? new Profile(data.profile) : {}
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.status = data.status
  }
}