export class AccountMilestone {
  constructor(data) {
    this.id = data.id
    this.accountId = data.accountId
    this.milestoneId = data.milestoneId
    this.claimed = data.claimed
    this.tier = data.tier
    this.milestone = data.milestone
    this.count = data.count
  }
}