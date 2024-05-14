import { logger } from "../utils/Logger.js";
import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";

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
  async getAccountMilestonesByAccountId(accountId) {
    const accountMilestones = await dbContext.AccountMilestones.find({ accountId }).populate('milestone');
    if (!accountMilestones) {
      return 'This user does not have any milestones'
    }
    return accountMilestones;
  }

  async claimMyMilestone(accountMilestoneId, accountId) {
    const claimMilestone = await dbContext.AccountMilestones.findById(accountMilestoneId);
    if (claimMilestone.accountId != accountId) {
      throw new BadRequest("You are not authorized to claim this Milestone");
    }
    claimMilestone.claimed = true;
    await claimMilestone.save();
    return claimMilestone;
  }
  // !SECTION

  // SECTION Function for Account Milestone related triggers
  async triggerAccountMilestone(check, accountId, challengeId = null) {
    const milestone = await dbContext.Milestones.findOne({ check });

    let challenge = null;
    if (challengeId) {
      challenge = await dbContext.Challenges.findById(challengeId);
      if (!accountId) { accountId = challenge.creatorId; }
    }
    
    // Get or Create AccountMilestone association & increment count
    let accountMilestone = await dbContext.AccountMilestones.findOne({ milestoneId: milestone.id, accountId });
    if (!accountMilestone) {
      accountMilestone = await dbContext.AccountMilestones.create({ milestoneId: milestone.id, accountId });
    }
    accountMilestone.count++;

    // Parse logic & Calc tier
    const milestoneLogicSplit = milestone.logic.split('%');
    const parsedMilestoneData = {
      maxTierLevel: parseInt(milestoneLogicSplit[0].split('-')[0]),
      operation: milestoneLogicSplit[0].split('-')[1],
      logicArr: milestoneLogicSplit[1].split('-'),
    };
    let calculatedTier = 0;
    let amCount = accountMilestone.count;
    for (let i = 0; i < parsedMilestoneData.maxTierLevel; i++) {
      if (amCount >= parseInt(parsedMilestoneData.logicArr[i])) {
        calculatedTier++;
      }
      if (amCount < parseInt(parsedMilestoneData.logicArr[i])) {
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
    accountMilestone.save();

    await accountService.calculateAccountRank({ id: accountId }, accountMilestone.xp);

    // return accountMilestone;
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
  // !SECTION

}

export const accountMilestonesService = new AccountMilestonesService();