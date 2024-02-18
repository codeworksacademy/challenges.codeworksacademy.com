export class AccountMilestone {
  constructor(data) {
    this.id = data.id
    this.tier = data.tier
    this.count = data.count
    this.claimed = data.claimed
    this.milestone = data.milestone
    this.accountId = data.accountId
    this.milestoneId = data.milestoneId
  }
}