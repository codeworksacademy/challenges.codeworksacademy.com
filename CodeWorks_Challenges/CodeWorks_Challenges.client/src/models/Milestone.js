import { Challenge } from './Challenge'
import { Account } from './Account'

export class Milestone {
  constructor(data) {
    this.id = data.id
    this.description = data.description
    this.check = data.check
    this.logic = data.logic
    this.ref = data.ref

    const logicParts = data.logic.split('%');
    const operationsArr = logicParts[0].split('-');

    this.tierThresholdArr = logicParts[1].split('-');
    this.maxTierLevel = Number(operationsArr[0]);
    this.operation = operationsArr[1];
  }
}