import { dbContext } from "../db/DbContext.js"
import { BadRequest } from "../utils/Errors.js"

class RewardsService {

  async getProfileRewards(profileId) {
    const rewards = await dbContext.Rewards.find({ accountId: profileId }).populate('challenge')
    if (!rewards) {
      throw new BadRequest('This user has not yet earned any rewards.')
    }
    return rewards
  }
  // FIXME - JAKE - Would the reward be retrieved by the claimedBy field or the accountId field in relation to the profileId? Would it not matter since they are the same value? - AJ
  // async getProfileRewards(profileId) {
  //   const rewards = await dbContext.Rewards.find({ claimedBy: profileId })
  //   .sort({ claimedAt: -1 })
  //   return rewards
  // }

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

  // async getMyRewards(accountId) {
  //   const rewards = await dbContext.Rewards.find({ claimedBy: accountId })
  //   .sort({ claimedAt: -1 })
  //   return rewards
  // }
}

export const rewardsService = new RewardsService()