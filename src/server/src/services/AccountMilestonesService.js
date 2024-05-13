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
  // !SECTION

  // SECTION Function for Account Milestone related triggers
  async triggerAccountMilestone(check, accountId) {
    // Get or Create AccountMilestone association & increment count
    let accountMilestone = await dbContext.AccountMilestones.findOne({ check, accountId }).populate('milestone');
    // @ts-ignore - Does not register virtuals as possible on object
    let milestone = accountMilestone?.milestone ?? {};
    if (!accountMilestone) {
      milestone = await dbContext.Milestones.findOne({ check });
      accountMilestone = await dbContext.AccountMilestones.create({ milestoneId: milestone.id, accountId });
    }
    accountMilestone.count++;

    // Parse logic & Calc tier
    const milestoneLogicSplit = milestone.logic.split('%');
    const parsedMilestoneData = {
      maxTierLevel: milestoneLogicSplit[0].split('-')[0],
      operation: milestoneLogicSplit[0].split('-')[1],
      logicArr: milestoneLogicSplit[1].split('-'),
    };
    let calculatedTier = 0;
    let amCount = accountMilestone.count;
    for (let i = 0; i < parsedMilestoneData.maxTierLevel; i++) {
      if (amCount >= parsedMilestoneData.logicArr[i]) {
        calculatedTier++;
      }
      if (amCount < parsedMilestoneData.logicArr[i]) {
        break;
      }
    }
    // If next tier, tier++, reset claimed, & calc new XP total
    if (calculatedTier > accountMilestone.tier) {
      accountMilestone.tier++;
      accountMilestone.claimed = false;
      // Calc new XP amt for this AccountMilestone
      let calculatedXp = 0;
      while (calculatedTier > 0) {
        calculatedXp += calculatedTier * 5;
        calculatedTier--;
      }
      accountMilestone.xp = calculatedXp;
    }

    // Update AccountMilestone with new data and return data
    accountMilestone.save();
    return accountMilestone;
  }

  async calcTotalAccountMilestoneXP(accountId) {
    const accountMilestones = await this.getAccountMilestonesByUserId(accountId);
    if (!Array.isArray(accountMilestones)) {
      logger.log('No milestones for this account');
      return 0;
    }
    let experience = 0;
    accountMilestones.forEach(am => experience += am.xp);
    return experience;
  }
  // !SECTION




  // SECTION remaining OG code
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

}

export const accountMilestonesService = new AccountMilestonesService();