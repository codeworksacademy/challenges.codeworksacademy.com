import { Reward } from './Reward.js';
import { StrDifficultyNum } from '../utils/StrDifficultyNum.js';
import { DateTime } from '../utils/DateTime.js';

export class Challenge {

  constructor(data) {
    this.id = data.id || data._id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.name = data.name || ''
    this.category = data.category || ''
    this.description = data.description || ''
    this.requirements = data.requirements || []
    this.coverImg = data.coverImg || 'https://i.ibb.co/b1bXrRw/card-gradient.png'
    this.createdAt = DateTime(data.createdAt)
    this.updatedAt = DateTime(data.updatedAt)
    this.supportLinks = data.supportLinks || []
    this.difficulty = data.difficulty| 1
    this.difficultyStr = StrDifficultyNum(data.difficulty) || 1
    this.status = data.status
    // this.pointValue = data.difficulty || 1
    this.badges = data.badges ? new Reward(data.badges) : null
    // this.answers = data.answers || ''
    this.answer = data.answer || ''
    this.isCancelled = data.isCancelled || false
    this.participantCount = data.participantCount
    this.completedCount = data.completedCount
    this.valid = data.valid
  }
}