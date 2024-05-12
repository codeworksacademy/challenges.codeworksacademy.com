import { logger } from "../utils/Logger.js";
import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { challengesService } from "./ChallengesService.js";
import mongoose from "mongoose";


class AccountMilestonesService {

  // SECTION from Account Milestone Controller
  async getAccountMilestonesByUserId(accountId) {
    const accountMilestones = await dbContext.AccountMilestones.find({ accountId }).populate('milestone');
    if (!accountMilestones) {
      return 'This user does not have any milestones'
    }
    return accountMilestones;
  }

  async claimMyMilestone(accountMilestoneId, userId) {
    const claimMilestone = await dbContext.AccountMilestones.findById(accountMilestoneId);
    if (claimMilestone.accountId != userId) {
      throw new BadRequest("You are not authorized to claim this Milestone");
    }
    claimMilestone.claimed = true;
    await claimMilestone.save();
    return claimMilestone;
  }

  // SECTION functions for triggers related to Account Milestone updates
  async getOrCreateAccountMilestone(milestoneId, accountId) {
    let foundMilestone = await dbContext.AccountMilestones.findOne({ milestoneId, accountId });
    if (!foundMilestone) {
      foundMilestone = await dbContext.AccountMilestones.create({ milestoneId, accountId });
    }
    return foundMilestone;
  }

  async triggerMilestone(milestone, event) {

  }

  // SECTION Calculations

  async calcTotalAccountMilestoneXP(user) {
    const myMilestones = await this.getAccountMilestonesByUserId(user.id);
    if (!Array.isArray(myMilestones)) {
      logger.log('No milestones for this account');
      return 0;
    }
    let experience = 0;
    myMilestones.forEach(am => {
      let experienceBasedOnTier = 0;
      let tier = am.tier;
      while (tier != 0) {
        experienceBasedOnTier += tier * 5;
        tier--;
      }
      experience += experienceBasedOnTier;
    });
    return experience;
  }







  // SECTION OG code

  async checkMilestonesByUserId(userId, checks) {
    const pulledChecks = await this.pullMilestoneChecks(checks)
    const checkPromises = pulledChecks.map(async pc => {
      await this.checkMilestones(pc, userId);
    });
    await Promise.all(checkPromises);
    // const milestones = await this.getMyMilestones(userId)

    // return milestones
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

    const myFoundMilestone = await this.getOrCreateAccountMilestone(milestone.id, userId);

    const parsedMilestoneData = this.parseLogic(milestone);

    if (myFoundMilestone.tier > parsedMilestoneData.maxTierLevel) {
      return myFoundMilestone
    }

    const milestoneCheckCount = await this.getCountByOperation(parsedMilestoneData, myFoundMilestone, userId);

    let tierToAssign = this.getLatestTier(parsedMilestoneData, milestoneCheckCount);

    if (milestoneCheckCount > myFoundMilestone.count) {
      myFoundMilestone.count = milestoneCheckCount

      if (tierToAssign > myFoundMilestone.tier) {
        myFoundMilestone.claimed = false
        myFoundMilestone.tier = tierToAssign
        myFoundMilestone.count = milestoneCheckCount
      }

      await myFoundMilestone.save()
    }
    return myFoundMilestone
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

  async getCountByOperation(parsedMilestoneData, myFoundMilestone, userId) {
    let count = 0

    const filterKey = {
      createdChallenge: { creatorId: userId }, //$gte
      joinedChallenge: { accountId: userId }, //$gte
      moderateChallenge: { $and: [{ accountId: userId }, { status: 'Active' }] }, //$gte
      submissionsChallenge: { status: { $in: ['submitted', 'completed'] } }, //$gteChallenge
      passingSubmissionsChallenge: { status: 'completed' }, //$gteChallenge
      submittedParticipant: { $and: [{ accountId: userId }, { status: { $in: ['submitted', 'completed'] } }] },//$gte
      passingParticipant: { $and: [{ accountId: userId }, { status: 'completed' }] }, //$gte
      allMilestones: { $sum: '$tier' } //$sum
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
        const myChallenges = await challengesService.getChallengesCreatedBy(userId, userId)

        const challengeParticipantsValue = await dbContext[milestoneRef].find({
          $and: [
            { challengeId: { $in: myChallenges } },
            filterKey[milestoneCheck]
          ]
        }).count();

        count = challengeParticipantsValue
        break;
      case "$increment":
        let tempValue = myFoundMilestone.count;
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

  async giveGradingMilestoneByAccountId(userId) {
    const check = ["gradeModerators"]
    const milestone = await this.checkMilestonesByUserId(userId, check)
    return milestone
  }

  // !SECTION

}

export const accountMilestonesService = new AccountMilestonesService();