export class Award{
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.points = data.points
    this.challenge = data.challenge
    this.timeAchieved = new Date(data.timeAchieved)
    this.color = data.color
  }
}