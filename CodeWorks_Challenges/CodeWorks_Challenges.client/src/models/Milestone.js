import { Challenge } from './Challenge'
import { Account } from './Account'

export class Milestone {
  constructor(data) {
    this.accountId = data.accountId
    this.milestoneId = data.milestoneId
    this.claimed = data.claimed
  }
}