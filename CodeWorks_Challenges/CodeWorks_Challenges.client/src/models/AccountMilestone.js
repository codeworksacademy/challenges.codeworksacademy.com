import { Challenge } from './Challenge'
import { Account } from './Account'

export class AccountMilestone {
  constructor(data) {
    this.accountId = data.accountId
    this.milestoneId = data.milestoneId
    this.claimed = data.claimed
    this.tier = data.tier
  }
}