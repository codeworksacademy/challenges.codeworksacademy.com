import { dbContext } from "../db/DbContext.js"
import { accountService } from "./AccountService.js";
import { challengesService } from "./ChallengesService.js";
import { profileService } from "./ProfileService.js";


class MilestonesService {

  milestone = {
    // Inside of this object add your function that corresponds to your milestone check
    createdChallengeCheck: async (check, userId) => {
      const logicArr = check.logic.split(' ');
      if (logicArr[0] == '$gte') {
        // check first for if the user already has accountMilestone so process can be interuppted
        // else all created challenges need to be retrieved and counted then compared to logicArr[1]
        const challengeCount = await challengesService.getMyChallenges(userId)
        if (challengeCount.length >= logicArr[1]) {
          return true;
          // will need to create the accountMilestone for this user to prevent running this function unnecessarily
        }
      }
    }
  }

  async checkMilestonesByAccountId(userId, checks) {
    const pulledChecks = await this.pullMilestoneChecks(checks)
    pulledChecks.forEach(pc => {
      this.milestone[pc.check + 'Check'](pc, userId);
    });
    // After all of the checks are performed a blanket get all accountMilestones can be performed because any relevant accountMilestones will have been created, Then that can be returned.
  }

  async pullMilestoneChecks(checks) {
    // This function is meant to retrieve all of the milestone checks via the checks submitted by the front end
    const pulledChecks = []
    checks.forEach(async c => {
      const userChecks = await dbContext.Milestones.find({ checks: c })
      pulledChecks.push(userChecks)
    });
    return pulledChecks;
  }

  async milestoneCreatedChallengeCheck() { }

}

export const milestonesService = new MilestonesService()