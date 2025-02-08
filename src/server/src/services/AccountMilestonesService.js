import { dbContext } from '../db/DbContext.js';
import { BadRequest } from '../utils/Errors.js';
import mongoose from 'mongoose';

class AccountMilestonesService {
  async checkMilestonesByUserId(userId, checks) {
    try {
      const pulledChecks = await this.pullMilestoneChecks(checks);
      const checkPromises = pulledChecks.map(pc => this.checkMilestones(pc, userId));
      await Promise.all(checkPromises);

      return await this.getMyMilestones(userId);
    } catch (error) {
      console.error('Error checking milestones:', error.message);
      throw new Error('Failed to check milestones. Please try again.');
    }
  }

  async pullMilestoneChecks(checks) {
    const queryChecks = { $or: checks.map(c => ({ check: c })) };
    return await dbContext.Milestones.find(queryChecks);
  }

  async checkMilestones(milestone, userId) {
    const myFoundMilestone = await this.getOrCreateMyMilestone(milestone, userId);
    const parsedMilestoneData = this.parseLogic(milestone);

    if (myFoundMilestone.tier > parsedMilestoneData.maxTierLevel) {
      return myFoundMilestone;
    }

    const milestoneCheckCount = await this.getCountByOperation(parsedMilestoneData, userId);
    const tierToAssign = this.getLatestTier(parsedMilestoneData, milestoneCheckCount);

    if (milestoneCheckCount > myFoundMilestone.count || tierToAssign > myFoundMilestone.tier) {
      myFoundMilestone.count = milestoneCheckCount;
      myFoundMilestone.tier = tierToAssign;
      myFoundMilestone.claimed = false;
      await myFoundMilestone.save();
    }

    return myFoundMilestone;
  }

  async getMyMilestones(userId) {
    return await dbContext.AccountMilestones.find({ accountId: userId }).populate('milestone');
  }

  async getOrCreateMyMilestone(milestone, userId) {
    let myFoundMilestone = await dbContext.AccountMilestones.findOne({
      milestoneId: milestone.id,
      accountId: userId,
    });

    if (!myFoundMilestone) {
      myFoundMilestone = await dbContext.AccountMilestones.create({
        milestoneId: milestone.id,
        accountId: userId,
      });
    }

    return myFoundMilestone;
  }

  parseLogic(milestone) {
    try {
      const [maxTierLevel, operation] = milestone.logic.split('%')[0].split('-');
      const tierThresholdArr = milestone.logic.split('%')[1].split('-');
      return {
        maxTierLevel,
        operation,
        tierThresholdArr,
        milestone: {
          ref: milestone.ref,
          check: milestone.check
        },
      };
    } catch (error) {
      console.error('Error parsing milestone logic:', error.message);
      throw new Error('Failed to parse milestone logic. Please try again.');
    }
  }

  async getCountByOperation(parsedMilestoneData, userId) {
    const filters = {
      createdChallenge: { creatorId: userId }, //$gte
      joinedChallenge: { accountId: userId }, //$gte
      moderateChallenge: { $and: [{ accountId: userId }, { status: 'Active' }] }, //$gte
      submissionsChallenge: { status: { $in: ['submitted', 'completed'] } }, //$gteChallenge
      passingSubmissionsChallenge: { status: 'completed' }, //$gteChallenge
      submittedParticipant: { $and: [{ accountId: userId }, { status: { $in: ['submitted', 'completed'] } }] },//$gte
      passingParticipant: { $and: [{ accountId: userId }, { status: 'completed' }] }, //$gte
      allMilestones: { $sum: '$tier' } //$sum
    };

    switch (parsedMilestoneData.operation) {
      case '$gte':
        return await dbContext[parsedMilestoneData.milestone.ref].countDocuments(filters[parsedMilestoneData.milestone.check]);

      case '$sum':
        return await dbContext[parsedMilestoneData.milestone.ref].aggregate([
          { $match: { accountId: new mongoose.Types.ObjectId(userId) } },
          { $group: { _id: null, sumValue: { $sum: '$tier' } } },
        ]).then(([{ sumValue }]) => sumValue);

      default:
        return 0;
    }
  }

  getLatestTier(parsedMilestoneData, count) {
    return parsedMilestoneData.tierThresholdArr.findIndex(threshold => count < threshold) + 1;
  }

  async getTotalMilestoneExperience(user) {
    const myMilestones = await this.getMyMilestones(user.id);
    const claimedMilestones = myMilestones.filter(milestone => milestone.claimed);

    return claimedMilestones.reduce((total, milestone) => {
      let tier = milestone.tier;
      let experience = 0;
      while (tier > 0) {
        experience += tier * 5;
        tier--;
      }
      return total + experience;
    }, 0);
  }
}

export const accountMilestonesService = new AccountMilestonesService();