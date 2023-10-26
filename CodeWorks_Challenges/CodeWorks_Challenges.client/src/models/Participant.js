import { Challenge } from './Challenge'

export class Participant {
  constructor(data) {
    this.id = data.id
    this.challengeId = data.challengeId
    this.accountId = data.accountId
    this.challenge = data.challenge ? new Challenge(data.challenge) : null
    //FIXME - JAKE - Just wanted to be sure to wait and remove the status property until we are sure we don't need it after you reference the schema in the server for a Participant. Thanks! - AJ
    // this.status = data.status || 'inactive'
    this.hasAuth = data.hasAuth || false
    this.profile = data.profile
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}