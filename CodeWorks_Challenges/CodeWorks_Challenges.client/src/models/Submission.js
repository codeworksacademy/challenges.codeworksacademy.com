import { Participant } from './ChallengeParticipant'
import { Challenge } from './Challenge'
import { DateTime } from '../utils/DateTime'

export class Submission {
  constructor(data) {
    this.id = data.id
    this.participantId = data.participantId
    this.challengeId = data.challengeId
    this.supportLinks = data.supportLinks
    this.isSubmitted = data.isSubmitted
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    this.submittedAt = DateTime(data.submittedAt)
  }
}