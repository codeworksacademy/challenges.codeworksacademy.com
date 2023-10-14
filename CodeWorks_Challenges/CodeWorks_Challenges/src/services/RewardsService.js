import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js"

class RewardsService {
  async createReward(newReward) {
    const reward = await dbContext.Rewards.create(newReward)
    await reward.populate('challenge participant')
    return reward
  }

  async claimReward(rewardId) {
    const reward = await dbContext.Rewards.findById(rewardId)
    if (!reward) {
      throw new BadRequest('Invalid Reward Id')
    }
    if (reward.claimed) {
      throw new BadRequest('Reward has already been claimed')
    }
    reward.claimed = true
    await reward.save()
    return reward
  }

  // async getProfileRewards(profileId) {
  //   const rewards = await dbContext.Rewards.find({ claimedBy: profileId })
  //   .sort({ claimedAt: -1 })
  //   return rewards
  // }

  // async getMyRewards(accountId) {
  //   const rewards = await dbContext.Rewards.find({ claimedBy: accountId })
  //   .sort({ claimedAt: -1 })
  //   return rewards
  // }
}

export const rewardsService = new RewardsService()