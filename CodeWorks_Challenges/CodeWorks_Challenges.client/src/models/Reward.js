import { Challenge } from './Challenge'
import { Account } from './Account'

export class Reward {
  constructor(data) {
    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.name = data.name
    this.badges = data.badges
    this.points = data.points
    this.experience = data.experience
    this.claimed = data.claimed
    this.claimedBy = data.claimedBy
    this.claimedAt = data.claimedAt
    this.participantId = data.participantId
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.account = data.account ? new Account(data.account) : null
  }
}