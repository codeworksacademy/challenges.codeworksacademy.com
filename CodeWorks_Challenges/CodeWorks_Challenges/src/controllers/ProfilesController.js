import { challengesService } from '../services/ChallengesService.js'
import { participantsService } from '../services/ParticipantsService.js'
import { profileService } from '../services/ProfileService.js'
import BaseController from '../utils/BaseController'

export class ProfilesController extends BaseController {
  constructor() {
    super('api/profiles')
    this.router
      .get('', this.findProfiles)
      .get('/:id', this.getProfile)
      .get('/:id/challenges', this.getProfileChallenges)
      .get('/:id/rewards', this.getProfileRewards)
      .get('/:id/participants', this.getParticipationsByUserId)
      .get('/:id/milestones', this.getProfileMilestones)
  }

  async findProfiles(req, res, next) {
    try {
      const name = req.query.name
      const offset = req.query.offset

      const profiles = await profileService.findProfiles(name, offset)
      res.send(profiles)
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfileById(req.params.id)
      res.send(profile)
    } catch (error) {
      next(error)
    }
  }

  async getProfileChallenges(req, res, next) {
    try {
      const challenges = await challengesService.getChallengesCreatedBy(req.params.id)
      return res.send(challenges)
    } catch (error) {
      next(error)
    }
  }

  async getProfileRewards(req, res, next) {
    try {
      const rewards = await participantsService.getChallengeRewards(req.params.id)
      return res.send(rewards)
    } catch (error) {
      next(error)
    }
  }

  async getParticipationsByUserId(req, res, next) {
    try {
      const participations = await participantsService.getParticipationsByUserId(req.params.id)

      return res.send(participations)
    } catch (error) {
      next(error)
    }
  }

  async getProfileMilestones(req, res, next) {
    try {
      const milestones = await profileService.getProfileMilestones(req.params.id)
      return res.send(milestones)
    } catch (error) {
      next(error)
    }
  }
}
