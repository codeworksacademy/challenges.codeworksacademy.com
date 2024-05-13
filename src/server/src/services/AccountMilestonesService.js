import { logger } from "../utils/Logger.js";
import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";

const milestoneChecks = [
  "createdChallenge",
  "joinedChallenge",
  "moderateChallenge",
  "submissionsChallenge",
  "passingSubmissionsChallenge",
  "gradeModerators", // This is to be called when a grading is performed
  "submittedParticipant",
  "passingParticipant",
  "allMilestones"
]

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
    let milestone = accountMilestone.milestone ? accountMilestone.milestone : null;
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

}

export const accountMilestonesService = new AccountMilestonesService();