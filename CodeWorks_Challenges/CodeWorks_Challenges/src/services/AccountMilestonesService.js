import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { challengesService } from "./ChallengesService.js";
import { cacheService } from "./CacheService.js"
import mongoose from "mongoose";



class AccountMilestonesService {

  async checkAcountMilestoneCache(userId, checks) {
    const accountMilestoneCache = await cacheService.getOrCreateCache('accountMilestoneCache')
    let cacheItem = cacheService.getCacheItem(userId, accountMilestoneCache)

    if (cacheItem) {
      let expiration = cacheService.checkCacheItemExpiration(cacheItem)
      if (expiration) {
        cacheItem = await this.checkMilestonesByAccountId(userId, checks)
        await cacheService.setCachedDataItem(userId, cacheItem, accountMilestoneCache)
      }
    }
    if (!cacheItem) {
      cacheItem = await this.checkMilestonesByAccountId(userId, checks)
      await cacheService.setCachedDataItem(userId, cacheItem, accountMilestoneCache)
    }
    return cacheItem
  }

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

  parseLogic(milestone) {
    const parsedMilestoneData = {}
    parsedMilestoneData.milestone = milestone
    // Example string '6-$gte%1-2-3-4-5-10'
    // This string parser will return 
    // operationsArr = ['6', '$gte']
    // maxTierLevel = 6
    // tierThresholdArr = ['1','2','3','4','5','10'] -- The positions of the array are the level of tier they represent +1, The value of the position is the requirement needed to get the tier.
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
      // gradeModerators:{}, // ChallengeParticipant does not hold a graderId
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

    // if (operation == "$gte") {
    //   count = await dbContext[milestone.ref].find(filterKey[milestone.check]).count();
    // }

    // if (operation == "$sum") {
    //   const userIdObject = new mongoose.Types.ObjectId(userId);
    //   const aggregateSum = await dbContext[milestone.ref].aggregate([
    //     {
    //       $match: { accountId: userIdObject }
    //     },
    //     {
    //       $group: { _id: null, 'sumsValue': filterKey[milestone.check] }
    //     }
    //   ]);

    //   count = aggregateSum[0].sumsValue;
    // }

    // if (operation == "$gteChallenge") {
    //   const accountChallenges = await challengesService.getChallengesCreatedBy(userId, userId)

    //   const challengeParticipantsValue = await dbContext[milestone.ref].find({
    //     $and: [
    //       { challengeId: { $in: accountChallenges } },
    //       filterKey[milestone.check]
    //     ]
    //   }).count();

    //   count = challengeParticipantsValue
    // }

    // if (operation == "$increment") {
    //   let tempValue = foundAccountMilestone.count;
    //   tempValue++
    //   count = tempValue
    // }
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

}

export const accountMilestonesService = new AccountMilestonesService()