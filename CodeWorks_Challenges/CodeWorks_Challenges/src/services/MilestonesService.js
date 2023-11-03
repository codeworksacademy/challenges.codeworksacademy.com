import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
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
  async editMilestone(milestoneId, milestoneData) {
    const editMilestone = await dbContext.Milestones.findById(milestoneId)
    editMilestone.check = milestoneData.check
    editMilestone.logic = milestoneData.logic
    editMilestone.ref = milestoneData.ref
    editMilestone.description = milestoneData.description
    await editMilestone.save();
  }

  async removeMilestone(milestoneId) {
    const milestone = await dbContext.Milestones.findById(milestoneId)
    if (!milestone) {
      throw new BadRequest(`milestone with ID ${milestoneId} does not exist`)
    }
    await milestone.remove()
  }

  // async checkMilestonesByAccountId(userId, checks) {
  //   const pulledChecks = await this.pullMilestoneChecks(checks)
  //   const checkPromises = pulledChecks.map(async pc => {
  //     await this.checkMilestones(pc, userId);
  //   });
  //   await Promise.all(checkPromises);
  //   // After all of the checks are performed a blanket get all accountMilestones can be performed because any relevant accountMilestones will have been created, Then that can be returned.
  //   const milestones = await this.getAccountMilestones(userId)
  //   return milestones
  // }

  // async pullMilestoneChecks(checks) {
  //   // This function is meant to retrieve all of the milestone checks via the checks submitted by the front end
  //   const queryChecks = { $or: [] }
  //   checks.forEach(c => {
  //     queryChecks.$or.push({ check: c })
  //   });
  //   const pulledChecks = await dbContext.Milestones.find(queryChecks)
  //   return pulledChecks;
  // }

  // async createAccountMilestone(AccountMilestoneData) {
  //   const accountMilestone = await dbContext.AccountMilestones.create(AccountMilestoneData)
  //   return accountMilestone
  // }
  // async getAccountMilestones(userId) {
  //   const foundAccountMilestones = await dbContext.AccountMilestones.find({ accountId: userId }).populate('milestone')
  //   if (!foundAccountMilestones) {
  //     new Error('This user does not have any milestones')
  //     return
  //   }
  //   return foundAccountMilestones
  // }
  // async getAccountMilestoneById(milestoneId, userId) {
  //   const foundAccountMilestone = await dbContext.AccountMilestones.findOne({ milestoneId: milestoneId, accountId: userId })
  //   if (!foundAccountMilestone) {
  //     return
  //   }
  //   return foundAccountMilestone
  // }

  // async checkMilestones(check, userId) {
  //   // Get the account Milestone, if one doesn't exist create one.
  //   // It will be assumed that this is a new account or new milestone
  //   // If this is an existing account that should return a higher tier, 
  //   // running the function a second time (frontend) may be required.
  //   const accountMilestoneData = {}
  //   const foundAccountMilestone = await this.getAccountMilestoneById(check.id, userId)

  //   if (!foundAccountMilestone) {
  //     accountMilestoneData.milestoneId = check.id
  //     accountMilestoneData.accountId = userId
  //     this.createAccountMilestone(accountMilestoneData)
  //   }


  //   if (foundAccountMilestone) {
  //     // Example string '5-$gte%1-2-3-4-5-10'
  //     const logicArr = check.logic;
  //     const logicParts = logicArr.split('%');
  //     const operationsArr = logicParts[0].split('-');
  //     const thresholdArr = logicParts[1].split('-');
  //     // This string parser will return 
  //     // operationsArr = ['5', '$gte']
  //     // thresholdsArr = ['1','2','3','4','5','10']

  //     if (check.check == 'createdChallenge') {
  //       if (foundAccountMilestone.tier >= operationsArr[0]) {
  //         return
  //       } else {
  //         const challengeCount = await challengesService.getMyChallenges(userId)
  //         let tier = 0;
  //         for (let i = 0; i < operationsArr[0]; i++) {
  //           if (challengeCount.length >= thresholdArr[i]) {
  //             tier = i + 1
  //           }
  //         }
  //         foundAccountMilestone.tier = tier
  //         await foundAccountMilestone.save()
  //         return foundAccountMilestone
  //       }
  //     }
  //   }
  // }
}

export const milestonesService = new MilestonesService()