import { Challenge } from './Challenge'

export class Moderator {
  constructor(data) {
    this.id = data.id
    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.status = data.status
    this.origin = data.origin
    this.profile = data.profile
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}