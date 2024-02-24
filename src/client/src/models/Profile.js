export class Profile {
  constructor(data) {
    this.id = data._id
    this.createdAt = data.createdAt

    this.name = data.name.charAt(0).toUpperCase() + data.name.slice(1) || 'Anonymous'
    this.nickname = data.nickname
    this.bio = data.bio

    this.resume = data.resume
    this.github = data.github
    this.linkedin = data.linkedin
    this.portfolioLink = data.portfolioLink

    this.picture = data.picture
    this.coverImg = data.coverImg

    this.xp = data.xp || 0
    this.reputation = data.reputation || 0
    this.rank = data.rank || 0
    this.title = data.title
  }
}