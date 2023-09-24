export class Account {
  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.roles = data.roles
    this.subs = data.subs
    this.name = data.name
    this.alias = data.alias
    this.age = data.age
    this.location = data.location
    this.coverImg = data.coverImg
    this.picture = data.picture
    this.bio = data.bio
    this.experience = data.experience
    this.reputation = data.reputation
  }
}
