import { Auth0Provider } from '@bcwdev/auth0provider';
import BaseController from '../utils/BaseController.js';
import { rewardsService } from '../services/RewardsService.js';

export class RewardsController extends BaseController {
  constructor() {
    super('api/rewards');
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      //REVIEW - I was going to add a get all rewards route, but I don't think we need it here. I believe we should be getting all rewards of a user from the profile controller. Open for discussion! - AJ 10/13/2023 @ 3:30pm
      .post('', this.createReward)
      .put('/:rewardId', this.claimReward)
  }

  async createReward(req, res, next) {
    try {
      const newReward = req.body
      const reward = await rewardsService.createReward(newReward)
      return res.send(reward)
    } catch (error) {
      next(error)
    }
  }

  async claimReward(req, res, next) {
    try {
      const rewardId = req.params.rewardId
      const reward = await rewardsService.claimReward(rewardId)
      return res.send(reward)
    } catch (error) {
      next(error)
    }
  }
}