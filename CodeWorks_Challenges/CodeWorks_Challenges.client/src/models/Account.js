export class Account {
  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.name = data.name
    this.picture = data.picture
    // TODO add additional properties if needed
    this.coverImage = data.coverImage
    this.aboutContent = data.aboutContent
    this.reputation = data.reputation || 0
  }
}
