// MilestonesService.js
import { dbContext } from "../db/DbContext.js";
import { BadRequest } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";

class MilestonesService {

  async createMilestone(accountId, milestoneData) {
    const milestone = await dbContext.Milestones.create({ ...milestoneData, accountId });
    return milestone;
  }

  async getMilestonesByAccountId(accountId) {
    const milestones = await dbContext.Milestones.find({ accountId });
    return milestones;
  }

  async updateMilestone(milestoneId, milestoneData) {
    const milestone = await dbContext.Milestones.findById(milestoneId);
    if (!milestone) {
      throw new BadRequest(`Milestone with ID ${milestoneId} does not exist`);
    }
    
    Object.assign(milestone, milestoneData);
    await milestone.save();
    return milestone;
  }

  async deleteMilestone(milestoneId) {
    const milestone = await dbContext.Milestones.findById(milestoneId);
    if (!milestone) {
      throw new BadRequest(`Milestone with ID ${milestoneId} does not exist`);
    }
    await milestone.remove();
    return milestone;
  }

  async checkMilestonesByUserId(userId, checks) {
    const milestones = await dbContext.Milestones.find({ accountId: userId, check: { $in: checks } });

    milestones.forEach(milestone => {
      this.evaluateMilestone(milestone);
    });

    return milestones;
  }

  evaluateMilestone(milestone) {
    const parsedLogic = this.parseLogic(milestone.logic);
    const milestoneCheckCount = this.getCountByOperation(parsedLogic, milestone.accountId);

    const newTier = this.calculateNewTier(parsedLogic, milestoneCheckCount);
    if (newTier > milestone.tier) {
      milestone.tier = newTier;
      milestone.claimed = false;
    }

    milestone.count = milestoneCheckCount;
    milestone.save();
  }

  parseLogic(logic) {
    const [tierInfo, thresholdInfo] = logic.split('%');
    const [maxTier, operation] = tierInfo.split('-');
    const tierThresholds = thresholdInfo.split('-').map(Number);

    return { maxTier: Number(maxTier), operation, tierThresholds };
  }

  getCountByOperation(parsedLogic, accountId) {
    // Implement specific logic to calculate the count based on the operation
    // Use accountId data (like xp, challenges, etc.) to determine milestone progress
    return 0; // Replace with actual logic
  }

  calculateNewTier(parsedLogic, count) {
    let newTier = 0;
    parsedLogic.tierThresholds.forEach((threshold, index) => {
      if (count >= threshold) {
        newTier = index + 1;
      }
    });
    return newTier;
  }

  async claimMilestone(milestoneId, accountId) {
    const milestone = await dbContext.Milestones.findById(milestoneId);
    if (!milestone || milestone.accountId.toString() !== accountId) {
      throw new BadRequest('Invalid milestone or user');
    }

    milestone.claimed = true;
    await milestone.save();
    return milestone;
  }

  async getTotalMilestoneExperience(accountId) {
    const milestones = await dbContext.Milestones.find({ accountId, claimed: true });

    let experience = 0;
    milestones.forEach(milestone => {
      let experienceBasedOnTier = 0;
      let tier = milestone.tier;
      while (tier != 0) {
        experienceBasedOnTier += tier * 5;
        tier--;
      }
      experience += experienceBasedOnTier;
    });

    await accountService.calculateAccountRank({ id: accountId });
    return experience;
  }
}

export const milestonesService = new MilestonesService();
