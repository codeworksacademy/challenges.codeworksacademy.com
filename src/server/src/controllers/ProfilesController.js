import { challengesService } from '../services/ChallengesService.js'
import { participantsService } from '../services/ParticipantsService.js'
import { profilesService } from '../services/ProfilesService.js'
import BaseController from '../utils/BaseController.js'

export class ProfilesController extends BaseController {
  constructor() {
    super('api/profiles')
    this.router
      .get('', this.findProfiles)
      .get('/:id', this.getProfileById)
      .get('/:id/challenges', this.getProfileChallenges)
      .get('/:id/rank', this.calculateProfileRank)
      .get('/:id/participation', this.getParticipationByUserId)
      .get('/:id/milestones', this.getProfileMilestones)
  }

  async findProfiles(req, res, next) {
    try {
      const name = req.query.name
      const offset = req.query.offset

      const profiles = await profilesService.findProfiles(name, offset);
      res.send(profiles);
    }
    catch (error) { next(error); }
  }

  async getProfileById(req, res, next) {
    try {
      const profile = await profilesService.getProfileById(req.params.id);
      res.send(profile);
    }
    catch (error) { next(error); }
  }

  async getProfileChallenges(req, res, next) {
    try {
      const challenges = await challengesService.getChallengesCreatedBy(req.params.id);
      return res.send(challenges);
    }
    catch (error) { next(error); }
  }

  async calculateProfileRank(req, res, next) {
    try {
      const profile = await profilesService.calculateProfileRank(req.params.id);
      return res.send(profile);
    }
    catch (error) { next(error); }
  }

  async calculateProfileReputation(req, res, next) {
    try {
      const reputationScore = await profilesService.calculateProfileReputation(req.params.id);
      res.send(reputationScore);
    }
    catch (error) { next(error); }
  }

  async getParticipationByUserId(req, res, next) {
    try {
      const participation = await participantsService.getParticipationByUserId(req.params.id);
      return res.send(participation);
    }
    catch (error) { next(error); }
  }

  async getProfileMilestones(req, res, next) {
    try {
      const milestones = await profilesService.getProfileMilestones(req.params.id);
      return res.send(milestones);
    }
    catch (error) { next(error); }
  }
}
