import { logger } from "../utils/Logger.js";
import { dbContext } from "../db/DbContext.js"
import { Forbidden } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";

class AccountMilestonesService {

  // SECTION from Account Milestone Controller
  async getAccountMilestonesByAccountId(accountId) {
    const accountMilestones = await dbContext.AccountMilestones.find({ accountId }).populate('milestone');
    if (!accountMilestones) {
      return 'This user does not have any milestones'
    }
    return accountMilestones;
  }

  async claimMyMilestone(accountMilestoneId, accountId) {
    const accountMilestone = await dbContext.AccountMilestones.findById(accountMilestoneId);
    if (accountMilestone.accountId != accountId) {
      throw new Forbidden("You are not authorized to claim this Milestone");
    }
    if (accountMilestone.claimed) { return accountMilestone; } // if already claimed, don't trigger counter
    accountMilestone.claimed = true;
    await accountMilestone.save();
    accountMilestonesService.triggerAccountMilestone('allMilestones', accountMilestone.accountId); // "COLLECTOR" - allMilestones
    return accountMilestone;
  }
  // !SECTION End

  // SECTION Function for Account Milestone related triggers
  async triggerAccountMilestone(check, accountId, challengeId = null, decrement = false) {
    const milestone = await dbContext.Milestones.findOne({ check });

    // If challengeId included, pull Challenge's creatorId to modify their account milestone
    let challenge = null;
    if (challengeId) {
      challenge = await dbContext.Challenges.findById(challengeId);
      if (!accountId) { accountId = challenge.creatorId; }
    }

    // Get or Create AccountMilestone association & increment count
    let accountMilestone = await dbContext.AccountMilestones.findOne({ milestoneId: milestone.id, accountId });
    if (!accountMilestone) {
      accountMilestone = await dbContext.AccountMilestones.create({ milestoneId: milestone.id, accountId });
      // Default first level accomplishment at 1 ?
      accountMilestone.count++;
      accountMilestone.tier++;
      accountMilestone.xp = 5;
      accountMilestone.save();
      return
    }

    if (decrement) { accountMilestone.count--; }
    else { accountMilestone.count++; }

    // Parse logic & Calc tier
    const milestoneLogicSplit = milestone.logic.split('%');
    const parsedMilestoneData = {
      maxTierLevel: parseInt(milestoneLogicSplit[0].split('-')[0]),
      operation: milestoneLogicSplit[0].split('-')[1],
      logicArr: milestoneLogicSplit[1].split('-'),
    };
    let calculatedTier = 0;
    for (let i = 0; i < parsedMilestoneData.maxTierLevel; i++) {
      if (accountMilestone.count >= parseInt(parsedMilestoneData.logicArr[i])) {
        calculatedTier++;
      }
      if (accountMilestone.count < parseInt(parsedMilestoneData.logicArr[i])) {
        break;
      }
    }

    // Resulting tier comparison, updates, & xp calc
    if (decrement) {
      accountMilestone.count--;
      if (calculatedTier < accountMilestone.tier) {
        accountMilestone.tier--;
        accountMilestone.claimed = true;
      }
    } else {
      accountMilestone.count++;
      if (calculatedTier > accountMilestone.tier) {
        accountMilestone.tier++;
        accountMilestone.claimed = false;
      }
    }
    let calculatedXp = 0;
    while (calculatedTier > 0) {
      calculatedXp += calculatedTier * 5;
      calculatedTier--;
    }
    accountMilestone.xp = calculatedXp;
    accountMilestone.save();

    accountService.calculateAccountRank({ id: accountId }, accountMilestone.xp);
  }

  async calcTotalAccountMilestoneXP(accountId) {
    const accountMilestones = await this.getAccountMilestonesByAccountId(accountId);
    if (!Array.isArray(accountMilestones)) {
      logger.log('No milestones for this account');
      return 0;
    }
    let experience = 0;
    accountMilestones.forEach(am => experience += am.xp);
    return experience;
  }
  // !SECTION End

}

export const accountMilestonesService = new AccountMilestonesService();