import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";
import { challengesService } from "./ChallengesService.js";
import { moderatorsService } from "./ModeratorsService.js";
import { participantsService } from "./ParticipantsService.js";
import { profileService } from "./ProfileService.js";


class AccountMilestonesService {
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
    const pulledChecks = await dbContext.Milestones.find(queryChecks)
    return pulledChecks;
  }

  async createAccountMilestone(AccountMilestoneData) {
    const accountMilestone = await dbContext.AccountMilestones.create(AccountMilestoneData)
    return accountMilestone
  }
  async getAccountMilestones(userId) {
    const foundAccountMilestones = await dbContext.AccountMilestones.find({ accountId: userId }).populate('milestone')
    if (!foundAccountMilestones) {
      new Error('This user does not have any milestones')
      return
    }
    return foundAccountMilestones
  }
  async getAccountMilestoneById(milestoneId, userId) {
    const foundAccountMilestone = await dbContext.AccountMilestones.findOne({ milestoneId: milestoneId, accountId: userId })
    if (!foundAccountMilestone) {
      return
    }
    return foundAccountMilestone
  }
  async claimMilestone(milestoneId) {
    const claimMilestone = await dbContext.AccountMilestones.findById(milestoneId)
    claimMilestone.claimed = true
    await claimMilestone.save()
    return claimMilestone
  }

  async checkMilestones(milestone, userId) {
    // Get the account Milestone, if one doesn't exist create one.
    // It will be assumed that this is a new account or new milestone
    // If this is an existing account that should return a higher tier, 
    // running the function a second time (frontend) may be required.
    const accountMilestoneData = {}
    const foundAccountMilestone = await this.getAccountMilestoneById(milestone.id, userId)

    if (!foundAccountMilestone) {
      accountMilestoneData.milestoneId = milestone.id
      accountMilestoneData.accountId = userId
      this.createAccountMilestone(accountMilestoneData)
    }

    // REVIEW Code Review Reflection - Kyle
    // It looks like my approach is not a plugin approach but, my code can be made better by --
    // Utilizing ref - ref can be set as a string to the same name as the schema on the back end, Allowing for a more efficient counting function
    // $gte can be checked against to push the function to the correct comparison


    if (foundAccountMilestone) {
      // Example string '6-$gte%1-2-3-4-5-10'
      const logicArr = milestone.logic;
      const logicParts = logicArr.split('%');
      const operationsArr = logicParts[0].split('-');
      const tierThresholdArr = logicParts[1].split('-');
      // This string parser will return 
      // operationsArr = ['5', '$gte']
      // tierThresholdArr = ['1','2','3','4','5','10'] -- The positions of the array are the level of tier they represent +1, The value of the position is the requirement needed to get the tier.

      const filterKey = {
        createdChallenge: { creatorId: userId },
        joinedChallenge: { accountId: userId },
        moderateChallenge: { $and: [{ accountId: userId }, { status: 'Active' }] }
      };

      const milestoneCheckCount = await dbContext[milestone.ref].find(filterKey[milestone.check]).count();

      if (foundAccountMilestone.tier < operationsArr[0]) { //This checks to see if the milestone is maxed out
        let tier = 0;

        for (let i = 0; i < operationsArr[0]; i++) {
          if (milestoneCheckCount >= tierThresholdArr[i]) {
            tier = i + 1
          }
        }

        if (tier > foundAccountMilestone.tier) {
          foundAccountMilestone.claimed = false
          foundAccountMilestone.tier = tier
        }
        await foundAccountMilestone.save()
        return foundAccountMilestone
      }
    }
  }
}

export const accountMilestonesService = new AccountMilestonesService()