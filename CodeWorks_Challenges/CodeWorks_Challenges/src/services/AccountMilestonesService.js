import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";
import { challengesService } from "./ChallengesService.js";
import { challengeModeratorsService } from "./ChallengeModeratorsService.js";
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
    const milestones = await this.getAccountMilestones(userId) //STUB Kyle - This could be made more specific with the $or get I learned.
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
  async claimMilestone(milestoneId) { //STUB Kyle - This could probably use a user check
    const claimMilestone = await dbContext.AccountMilestones.findById(milestoneId)
    claimMilestone.claimed = true
    await claimMilestone.save()
    return claimMilestone
  }

  async getOrCreateAccountMilestone(milestone, userId, accountMilestoneData) {
    let foundAccountMilestone = await this.getAccountMilestoneById(milestone.id, userId);

    if (!foundAccountMilestone) {
      accountMilestoneData.milestoneId = milestone.id;
      accountMilestoneData.accountId = userId;
      foundAccountMilestone = await this.createAccountMilestone(accountMilestoneData);
    }
    return foundAccountMilestone;
  }

  async checkMilestones(milestone, userId) {

    const accountMilestoneData = {}
    const foundAccountMilestone = await this.getOrCreateAccountMilestone(milestone, userId, accountMilestoneData);

    // Example string '6-$gte%1-2-3-4-5-10'
    const logicArr = milestone.logic;
    const logicParts = logicArr.split('%');
    const operationsArr = logicParts[0].split('-');
    const tierThresholdArr = logicParts[1].split('-');
    const maxTierLevel = operationsArr[0]
    // This string parser will return 
    // operationsArr = ['6', '$gte']
    // maxTierLevel = 6
    // tierThresholdArr = ['1','2','3','4','5','10'] -- The positions of the array are the level of tier they represent +1, The value of the position is the requirement needed to get the tier.

    if (foundAccountMilestone.tier > maxTierLevel) {
      return foundAccountMilestone
    }

    const filterKey = {
      createdChallenge: { creatorId: userId },
      joinedChallenge: { accountId: userId },
      moderateChallenge: { $and: [{ accountId: userId }, { status: 'Active' }] }
    };

    const milestoneCheckCount = await dbContext[milestone.ref].find(filterKey[milestone.check]).count();

    let tierToAssign = 0;

    for (let i = 0; i < maxTierLevel; i++) {
      if (milestoneCheckCount >= tierThresholdArr[i]) {
        tierToAssign = i + 1
      }
    }

    if (tierToAssign > foundAccountMilestone.tier) {
      foundAccountMilestone.claimed = false
      foundAccountMilestone.tier = tierToAssign
      await foundAccountMilestone.save()
    }
    return foundAccountMilestone
  }

  async getTotalMilestoneExperience(user) {
    let experience = 0
    const accountMilestones = await this.getAccountMilestones(user.id)
    accountMilestones.forEach(am => {
      let experienceBasedOnTier = 0
      let tier = am.tier
      while (tier != 0) {
        experienceBasedOnTier += tier * 5
        tier--
      }
      experience += experienceBasedOnTier
    });
    return experience
  }
}

export const accountMilestonesService = new AccountMilestonesService()