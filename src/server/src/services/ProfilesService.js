import { dbContext } from '../db/DbContext.js'
import { accountMilestonesService } from "./AccountMilestonesService.js"
import { accountService } from "./AccountService.js"

// IMPORTANT profiles should not be updated or modified in any way here. Use the AccountService

class ProfilesService {
  /**
    * Returns a user profile from its id
    * @param {string} accountId
   */
  async getProfileById(accountId) {
    const profile = await dbContext.Account.findById(accountId);
    return profile;
  }

  /**
    * Returns a list user profiles from a query search of name likeness
    * limits to first 20 without offset
    * @param {string} name
   */
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

  async calculateProfileRank(accountId) {
    const profile = await this.getProfileById(accountId);
    const totalMilestoneExperience = await accountMilestonesService.getTotalMilestoneExperience(profile);
    const totalExperience = profile.xp + totalMilestoneExperience;
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

  async getProfileMilestones(accountId) {
    const foundMilestones = await dbContext.AccountMilestones.find({ accountId }).populate('milestone')
    if (!foundMilestones) {
      new Error('This user does not have any milestones') // NOTE should this be an error?
      return
    }
    return foundMilestones
  }

  //   async getProfileChallengeBadges(id) {
  //     const foundChallengeBadges = await dbContext.Account.findById(id)
  //     const completedChallenges = await dbContext.ChallengeParticipants.find({ accountId: id, status: 'completed' })
  // }
}

export const profilesService = new ProfilesService()
