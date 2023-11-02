import { dbContext } from "../db/DbContext.js"
import { accountService } from "./AccountService.js";
import { challengesService } from "./ChallengesService.js";
import { profileService } from "./ProfileService.js";


class MilestonesService {

  async createMilestone(milestoneData) {
    const milestone = await dbContext.Milestones.create(milestoneData)
    return milestone
  }

  async checkMilestonesByAccountId(userId, checks) {
    const pulledChecks = await this.pullMilestoneChecks(checks)
    pulledChecks.forEach(pc => {
      this.milestone[pc.check + 'Check'](pc, userId);
    });
    // After all of the checks are performed a blanket get all accountMilestones can be performed because any relevant accountMilestones will have been created, Then that can be returned.
  }

  async pullMilestoneChecks(checks) {
    // This function is meant to retrieve all of the milestone checks via the checks submitted by the front end
    const pulledChecks = []
    checks.forEach(async c => {
      const userChecks = await dbContext.Milestones.find({ checks: c })
      pulledChecks.push(userChecks)
    });
    return pulledChecks;
  }

  async createAccountMilestone(AccountMilestoneData) {
    const accountMilestone = await dbContext.Milestones.create(AccountMilestoneData)
    return accountMilestone
  }
  async getAccountMilestoneById(milestoneId, userId) {
    const foundAccountMilestone = await dbContext.AccountMilestones.findOne({ milestoneId: milestoneId, accountId: userId })
    if (!foundAccountMilestone) {
      // new Error('No account Milestone with that Id exits')
      // I don't think it should be an error necessarily?
      return
    }
    return foundAccountMilestone
  }

  milestone = {
    // Inside of this object add your function that corresponds to your milestone check
    createdChallengeCheck: async (check, userId) => {
      // example string '5-$gte%1-2-3-4-5-10'
      // MaxTier-function-thresholds
      const logicArr = check.logic.split('%');
      const thresholdArr = logicArr[1].split('-')
      logicArr.length = 1
      logicArr.split('-')
      const accountMilestoneData = {}
      const foundAccountMilestone = await this.getAccountMilestoneById(check.id, userId)
      if (foundAccountMilestone) {
        if (foundAccountMilestone.tier >= logicArr[0]) {
          // AccountMilestone is maxed no more work to do
          return
        } else {
          // AccountMilestone is not maxed out
          const challengeCount = await challengesService.getMyChallenges(userId)
          let tier = 0;
          for (let i = 0; i < logicArr[0]; i++) {
            challengeCount.length >= thresholdArr[i];
            tier = i + 1
          }
          foundAccountMilestone.tier = tier
          await foundAccountMilestone.save()
          return foundAccountMilestone
        }
      } else {
        // No AccountMilestone data found, start from scratch
        accountMilestoneData.milestoneId = check.id
        accountMilestoneData.accountId = userId
        this.createAccountMilestone(accountMilestoneData)
      }

    }
  }

}

export const milestonesService = new MilestonesService()