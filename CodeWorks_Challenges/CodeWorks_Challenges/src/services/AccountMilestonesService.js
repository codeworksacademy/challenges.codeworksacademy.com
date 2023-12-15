import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { challengesService } from "./ChallengesService.js";
import { cacheService } from "./CacheService.js"
import mongoose from "mongoose";



class AccountMilestonesService {

  async checkAcountMilestoneCache(accountId, userId, checks) {
    const cacheId = 'accountMilestoneCache'
    let response = await cacheService.checkCache(accountId, userId, cacheId)
    let cacheItem = response.cacheItem ? response.cacheItem.dataToCache : {}
    const status = response.status

    if (status == 'notFound' || status == 'expired') {

      cacheItem = await this.checkMilestonesByUserId(userId, checks);
      await cacheService.setCachedDataItem(userId, cacheItem, cacheId);

    } else if (status == 'ownedByUser') {

      cacheItem = await this.checkMilestonesByUserId(userId, checks);
      await cacheService.forceCacheItemUpdate(userId, cacheItem, cacheId)

    }
    return cacheItem
  }
  //#region calculate accountMilestones
  async checkMilestonesByUserId(userId, checks) {
    const pulledChecks = await this.pullMilestoneChecks(checks)
    const checkPromises = pulledChecks.map(async pc => {
      await this.checkMilestones(pc, userId);
    });
    await Promise.all(checkPromises);
    const milestones = await this.getAccountMilestones(userId)

    return milestones
  }
  async pullMilestoneChecks(checks) {
    const queryChecks = { $or: [] }
    checks.forEach(c => {
      queryChecks.$or.push({ check: c })
    });
    const pulledChecks = await dbContext.Milestones.find(queryChecks)
    return pulledChecks;
  }

  async checkMilestones(milestone, userId) {

    const foundAccountMilestone = await this.getOrCreateAccountMilestone(milestone, userId);

    const parsedMilestoneData = this.parseLogic(milestone);

    if (foundAccountMilestone.tier > parsedMilestoneData.maxTierLevel) {
      return foundAccountMilestone
    }

    const milestoneCheckCount = await this.getCountByOperation(parsedMilestoneData, foundAccountMilestone, userId);

    let tierToAssign = this.getLatestTier(parsedMilestoneData, milestoneCheckCount);

    if (milestoneCheckCount > foundAccountMilestone.count) {
      foundAccountMilestone.count = milestoneCheckCount

      if (tierToAssign > foundAccountMilestone.tier) {
        foundAccountMilestone.claimed = false
        foundAccountMilestone.tier = tierToAssign
        foundAccountMilestone.count = milestoneCheckCount
      }

      await foundAccountMilestone.save()
    }
    return foundAccountMilestone
  }

  async getAccountMilestones(userId) {
    const foundAccountMilestones = await dbContext.AccountMilestones.find({ accountId: userId }).populate('milestone')
    if (!foundAccountMilestones) {
      new Error('This user does not have any milestones')
      return
    }
    return foundAccountMilestones
  }

  async getOrCreateAccountMilestone(milestone, userId) {
    const accountMilestoneData = {}
    let foundAccountMilestone = await this.getAccountMilestoneById(milestone.id, userId);

    if (!foundAccountMilestone) {
      accountMilestoneData.milestoneId = milestone.id;
      accountMilestoneData.accountId = userId;
      foundAccountMilestone = await this.createAccountMilestone(accountMilestoneData);
    }
    return foundAccountMilestone;
  }

  async createAccountMilestone(AccountMilestoneData) {
    const accountMilestone = await dbContext.AccountMilestones.create(AccountMilestoneData)
    return accountMilestone
  }

  async getAccountMilestoneById(milestoneId, userId) {
    const foundAccountMilestone = await dbContext.AccountMilestones.findOne({ milestoneId: milestoneId, accountId: userId })
    if (!foundAccountMilestone) {
      return
    }
    return foundAccountMilestone
  }

  parseLogic(milestone) {
    const parsedMilestoneData = {}
    parsedMilestoneData.milestone = milestone
    // Example string '6-$gte%1-2-3-4-5-10'
    // This string parser will return 
    // operationsArr = ['6', '$gte']
    // maxTierLevel = 6
    // tierThresholdArr = ['1','2','3','4','5','10'] 
    const logicArr = milestone.logic;
    const logicParts = logicArr.split('%');
    const operationsArr = logicParts[0].split('-');
    parsedMilestoneData.tierThresholdArr = logicParts[1].split('-');
    parsedMilestoneData.maxTierLevel = operationsArr[0];
    parsedMilestoneData.operation = operationsArr[1];
    return parsedMilestoneData;
  }

  async getCountByOperation(parsedMilestoneData, foundAccountMilestone, userId) {
    let count = 0

    const filterKey = {
      createdChallenge: { creatorId: userId },
      joinedChallenge: { accountId: userId },
      moderateChallenge: { $and: [{ accountId: userId }, { status: 'Active' }] },
      submissionsChallenge: { status: { $in: ['submitted', 'completed'] } },
      passingSubmissionsChallenge: { status: 'completed' },
      submittedParticipant: { $and: [{ accountId: userId }, { status: { $in: ['submitted', 'completed'] } }] },
      passingParticipant: { $and: [{ accountId: userId }, { status: 'completed' }] },
      allMilestones: { $sum: '$tier' }
    };
    const milestoneRef = parsedMilestoneData.milestone.ref
    const milestoneCheck = parsedMilestoneData.milestone.check
    switch (parsedMilestoneData.operation) {
      case "$gte":
        count = await dbContext[milestoneRef].find(filterKey[milestoneCheck]).count();
        break;
      case "$sum":
        const userIdObject = new mongoose.Types.ObjectId(userId);
        const aggregateSum = await dbContext[milestoneRef].aggregate([
          {
            $match: { accountId: userIdObject }
          },
          {
            $group: { _id: null, 'sumsValue': filterKey[milestoneCheck] }
          }
        ]);

        count = aggregateSum[0].sumsValue;
        break;
      case "$gteChallenge":
        const accountChallenges = await challengesService.getChallengesCreatedBy(userId, userId)

        const challengeParticipantsValue = await dbContext[milestoneRef].find({
          $and: [
            { challengeId: { $in: accountChallenges } },
            filterKey[milestoneCheck]
          ]
        }).count();

        count = challengeParticipantsValue
        break;
      case "$increment":
        let tempValue = foundAccountMilestone.count;
        tempValue++
        count = tempValue
        break;

      default:
        count = 0;
        break;
    }
    return count;
  }

  getLatestTier(parsedMilestoneData, milestoneCheckCount) {
    let tierToAssign = 0;

    for (let i = 0; i < parsedMilestoneData.maxTierLevel; i++) {
      if (milestoneCheckCount >= parsedMilestoneData.tierThresholdArr[i]) {
        tierToAssign = i + 1;
      }
    }
    return tierToAssign;
  }

  //#endregion

  async claimAccountMilestone(milestoneId, userId) {
    const claimMilestone = await dbContext.AccountMilestones.findById(milestoneId)
    if (claimMilestone.accountId != userId) {
      throw new BadRequest("Something went wrong, You cannot make this change")
    }
    claimMilestone.claimed = true
    await claimMilestone.save()
    return claimMilestone
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

  async giveGradingMilestoneByAccountId(userId) {
    const check = ["gradeModerators"]
    const milestone = await this.checkMilestonesByUserId(userId, check)
    return milestone
  }

}

export const accountMilestonesService = new AccountMilestonesService()