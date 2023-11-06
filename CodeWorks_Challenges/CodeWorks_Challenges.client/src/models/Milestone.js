import { Challenge } from './Challenge'
import { Account } from './Account'

export class Milestone {
  constructor(data) {
    this.id = data.id
    this.description = data.description
    this.check = data.check
    this.logic = data.logic
    this.ref = data.ref
  }
}