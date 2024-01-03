import { dbContext } from '../db/DbContext.js'

// IMPORTANT profiles should not be updated or modified in any way here. Use the AccountService

class ProfileService {
  /**
    * Returns a user profile from its id
    * @param {string} id
   */
  async getProfileById(id) {
    const profile = await dbContext.Account.findById(id)
    const profileReputation = await dbContext.Challenges.find({ creatorId: id }).select('reputationIds')
    const totalReputation = profileReputation.map(r => r.reputationIds.length)
    const reducer = (acc, curr) => acc + curr
    const total = totalReputation.reduce(reducer)
    profile.reputation = total
    return profile
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

  async getProfileMilestones(id) {
    const foundMilestones = await dbContext.AccountMilestones.find({ accountId: id }).populate('milestone')
    if (!foundMilestones) {
      new Error('This user does not have any milestones')
      return
    }
    return foundMilestones
  }
}

export const profileService = new ProfileService()
