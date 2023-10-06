import { StrDifficultyNum } from '../utils/StrDifficultyNum.js';
import { DateTime } from '../utils/DateTime.js';

export class Challenge {

  
  constructor(data) {
    this.id = data.id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.name = data.name || ''
    this.description = data.description || ''
    this.steps = data.steps || []
    this.coverImg = data.coverImg || 'https://placehold.it/200x200'
    this.createdAt = DateTime(data.createdAt)
    this.updatedAt = DateTime(data.updatedAt)
    this.supportLinks = data.supportLinks || []
    this.difficulty = StrDifficultyNum(data.difficulty) || 1
    this.pointValue = data.pointValue || 1
    this.answers = data.answers || []
    this.isCancelled = data.isCancelled || false
    this.participantCount = data.participantCount
  }
}