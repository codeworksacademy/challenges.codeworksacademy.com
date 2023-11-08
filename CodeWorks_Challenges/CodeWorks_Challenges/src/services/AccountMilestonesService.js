import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";
import { challengesService } from "./ChallengesService.js";
import { moderatorsService } from "./ModeratorsService.js";
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
    claimMilestone.claimedAt = new Date()
    await claimMilestone.save()
    return claimMilestone
  }

  async checkMilestones(check, userId) {
    // Get the account Milestone, if one doesn't exist create one.
    // It will be assumed that this is a new account or new milestone
    // If this is an existing account that should return a higher tier, 
    // running the function a second time (frontend) may be required.
    const accountMilestoneData = {}
    const foundAccountMilestone = await this.getAccountMilestoneById(check.id, userId)

    if (!foundAccountMilestone) {
      accountMilestoneData.milestoneId = check.id
      accountMilestoneData.accountId = userId
      this.createAccountMilestone(accountMilestoneData)
    }

    // REVIEW I would like some explanation on the tier being used here.

    // REVIEW KYLE
    // tier is being used to track the level of a given milestone, a milestone has several versions of it's self. create 1 challenge, create 2 challenges, create 100 challenges. 
    // Since these are nearly Identical I was using the threshold array to decide if the relevant tier (the position it has in the threshold array) had been achieved. 
    // Instead of creating 5 createChallenge Achievements, tier is being used to simulate this. Tier is also the value responsible for making these milestones 'claimable' again. (if tier> foundAccountMilestone.tier) {claimed = false;}

    // STUB Kyle operationsArr[0] is also a tier checker, it checks to see if the tier is at it's highest value and exits the function and avoids the extra calls to other services, It looks like the value might have needed to be different though.
    // STUB Kyle I see that ref is removed, I had questions about that thank you.
    // STUB Kyle Claimed could be an integer instead of a bool and if your claimed is lower than your tier that tier is considered unclaimed - This would allow you to claim each individual tier instead of all of them at once in case you go from tier 0 to tier 10

    if (foundAccountMilestone) {
      // Example string '5-$gte%1-2-3-4-5-10'
      const logicArr = check.logic;
      const logicParts = logicArr.split('%');
      const operationsArr = logicParts[0].split('-');
      const thresholdArr = logicParts[1].split('-');
      // This string parser will return 
      // operationsArr = ['5', '$gte']
      // thresholdsArr = ['1','2','3','4','5','10']
      // if (foundAccountMilestone.tier < operationsArr[0]) { //This checks to see if the milestone is maxed out
      //   let tier = 0;
      // STUB Kyle This might be able to be refactored better so that the $gte calls the for loop as it is identical for this type of milestone check.
      // STUB that might better relfect the plugin pattern, as I've written it $gte isn't doing anything other than being a reference to the developer.
      //   if (check.check == 'createdChallenge') { 
      //     const challengeCount = await challengesService.getChallengesCreatedBy(userId)
      //     for (let i = 0; i < operationsArr[0]; i++) {
      //       if (challengeCount.length >= thresholdArr[i]) {
      //         tier = i + 1
      //       }
      //     }
      //   }
      //   if (check.check == 'joinedChallenge') {
      //     const participantCount = await participantsService.getParticipantsByAccount(userId)
      //     for (let i = 0; i < operationsArr[0]; i++) {
      //       if (participantCount.length >= thresholdArr[i]) {
      //         tier = i + 1
      //       }
      //     }
      //   }
      //   if (check.check == 'moderateChallenge') {
      //     const moderationCount = await moderatorsService.getMyModerationsByProfileId(userId)
      //     for (let i = 0; i < operationsArr[0]; i++) {
      //       if (moderationCount.length >= thresholdArr[i]) {
      //         tier = i + 1
      //       }
      //     }
      //   }
      // if (foundAccountMilestone.tier > tier) {
      //   foundAccountMilestone.claimedAt = null
      // }
      // foundAccountMilestone.tier = tier
      // await foundAccountMilestone.save()
      // return foundAccountMilestone
      // }
    }
  }
}

export const accountMilestonesService = new AccountMilestonesService()