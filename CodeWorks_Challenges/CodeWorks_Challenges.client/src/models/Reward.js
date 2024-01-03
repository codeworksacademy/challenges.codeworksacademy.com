import { Challenge } from './Challenge'
import { Account } from './Account'

export class Reward {
  constructor(data) {
    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.name = data.name
    this.claimed = data.claimed
    this.claimedAt = data.claimedAt
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.account = data.account ? new Account(data.account) : null
  }
}