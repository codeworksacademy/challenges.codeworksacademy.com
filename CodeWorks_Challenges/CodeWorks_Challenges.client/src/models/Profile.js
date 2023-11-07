export class Profile {
  constructor(data) {
    this.id = data._id
    this.name = data.name || ''
    this.picture = data.picture
    this.experience = data.experience
    this.reputation = data.reputation
    this.rank = data.rank
    this.title = data.title
  }
}