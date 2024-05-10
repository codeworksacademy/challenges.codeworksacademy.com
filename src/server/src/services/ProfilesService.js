import { dbContext } from '../db/DbContext.js'
import { accountMilestonesService } from "./AccountMilestonesService.js"
import { accountService } from "./AccountService.js"

// IMPORTANT profiles should not be updated or modified in any way here. Use the AccountService

class ProfilesService {

  async getProfileById(accountId) {
    const profile = await dbContext.Account.findById(accountId);
    return profile;
  }

  //  Returns a list user profiles from a query search of name likeness; limits to first 20 without offset
  async findProfiles(name = '', offset = 0) {
    const filter = new RegExp(name, 'ig')
    return await dbContext.Account
      .aggregate([{
        $match: { name: filter }
      }])
      .collation({ locale: 'en_US', strength: 1 })
      .skip(Number(offset))
      .limit(20)
      .exec()
  }


  //   async getProfileChallengeBadges(id) {
  //     const foundChallengeBadges = await dbContext.Account.findById(id)
  //     const completedChallenges = await dbContext.ChallengeParticipants.find({ accountId: id, status: 'completed' })
  // }

  async calculateProfileRank(accountId) {
    const profile = await this.getProfileById(accountId);
    const totalMilestoneXP = await accountMilestonesService.calcAccountMilestoneXP(profile);
    const totalExperience = profile.xp + totalMilestoneXP;
    const rank = totalExperience;

    await accountService.updateAccount(accountId, { rank });

    return { ...profile.toObject(), rank };
  }

  // NOTE was not routed in at the controller nor called upon anywhere
  // async calculateProfileReputation(id) {
  //   const challenges = await dbContext.Challenges.find({ creatorId: id }).select('reputationIds')
  //   const totalReputation = challenges.map(r => r.reputationIds.length)

  //   let total = 0
  //   for (let i = 0; i < totalReputation.length; i++) {
  //     total += totalReputation[i]
  //   }

  //   await dbContext.Account.findByIdAndUpdate(id, { reputation: total })
  //   return total
  // }

}

export const profilesService = new ProfilesService();