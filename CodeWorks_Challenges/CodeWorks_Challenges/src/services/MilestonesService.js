import { dbContext } from "../db/DbContext.js"
import { accountService } from "./AccountService.js";
import { challengesService } from "./ChallengesService.js";
import { profileService } from "./ProfileService.js";


class MilestonesService {

  async createMilestone(milestoneData) {
    const milestone = await dbContext.Milestones.create(milestoneData)
    return milestone
  }
  async getMilestones() {
    const milestones = await dbContext.Milestones.find()
    return milestones
  }

  async checkMilestonesByAccountId(userId, checks) {
    const pulledChecks = await this.pullMilestoneChecks(checks)
    const checkPromises = pulledChecks.map(async pc => {
      await this.checkMilestones(pc, userId);
    });
    await Promise.all(checkPromises);
    // After all of the checks are performed a blanket get all accountMilestones can be performed because any relevant accountMilestones will have been created, Then that can be returned.
    const milestones = await this.getAccountMilestones(userId)
    return milestones
  }

  async pullMilestoneChecks(checks) {
    // This function is meant to retrieve all of the milestone checks via the checks submitted by the front end
    const queryChecks = { $or: [] }
    checks.forEach(c => {
      queryChecks.$or.push({ check: c })
    });
    // const query = {
    //   $or: [
    //     { x: valueX }, 
    //     { y: valueY }, 
    //   ]
    // };
    const pulledChecks = await dbContext.Milestones.find(queryChecks)
    return pulledChecks;
  }

  async createAccountMilestone(AccountMilestoneData) {
    const accountMilestone = await dbContext.Milestones.create(AccountMilestoneData)
    return accountMilestone
  }
  async getAccountMilestones(userId) {
    const foundAccountMilestones = await dbContext.AccountMilestones.find({ accountId: userId })
    if (!foundAccountMilestones) {
      new Error('This user does not have any milestones')
      return
    }
    return foundAccountMilestones
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

  async checkMilestones(check, userId) {
    // example string '5-$gte%1-2-3-4-5-10'
    // MaxTier-function-thresholds
    const logicArr = check.logic.split('%');
    const thresholdArr = logicArr[1].split('-')
    logicArr.length = 1
    logicArr.split('-')
    const accountMilestoneData = {}
    if (check.check == 'createdChallenge') {
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
  // milestone = {
  //   // Inside of this object add your function that corresponds to your milestone check
  //   createdChallengeCheck: async (check, userId) => {
  //     // example string '5-$gte%1-2-3-4-5-10'
  //     // MaxTier-function-thresholds
  //     const logicArr = check.logic.split('%');
  //     const thresholdArr = logicArr[1].split('-')
  //     logicArr.length = 1
  //     logicArr.split('-')
  //     const accountMilestoneData = {}
  //     const foundAccountMilestone = await this.getAccountMilestoneById(check.id, userId)
  //     if (foundAccountMilestone) {
  //       if (foundAccountMilestone.tier >= logicArr[0]) {
  //         // AccountMilestone is maxed no more work to do
  //         return
  //       } else {
  //         // AccountMilestone is not maxed out
  //         const challengeCount = await challengesService.getMyChallenges(userId)
  //         let tier = 0;
  //         for (let i = 0; i < logicArr[0]; i++) {
  //           challengeCount.length >= thresholdArr[i];
  //           tier = i + 1
  //         }
  //         foundAccountMilestone.tier = tier
  //         await foundAccountMilestone.save()
  //         return foundAccountMilestone
  //       }
  //     } else {
  //       // No AccountMilestone data found, start from scratch
  //       accountMilestoneData.milestoneId = check.id
  //       accountMilestoneData.accountId = userId
  //       this.createAccountMilestone(accountMilestoneData)
  //     }

  //   }
  // }

}

export const milestonesService = new MilestonesService()