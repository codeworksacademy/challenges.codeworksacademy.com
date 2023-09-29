import { StrDifficultyNum } from '../utils/StrDifficultyNum.js';
import FormatDateAndTime from '../utils/DateTime.js';

export class Challenge {
  constructor(data) {
    this.id = data.id
    this.creatorId = data.creatorId
    this.creator = data.creator
    this.name = data.name
    this.description = data.description
    this.coverImg = data.coverImg
    this.createdAt = FormatDateAndTime(data.createdAt)
    this.updatedAt = FormatDateAndTime(data.updatedAt)
    this.supportLinks = data.supportLinks
    this.difficulty = StrDifficultyNum(data.difficulty)
    this.pointValue = data.pointValue
    this.answers = data.answers
    this.isCancelled = data.isCancelled
    this.events = data.events
    this.participantCount = data.participantCount
  }
}

