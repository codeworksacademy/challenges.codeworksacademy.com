export class Account {
  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.name = data.name
    this.picture = data.picture
    this.coverImg = data.coverImg || 'https://images.unsplash.com/photo-1484820986637-7ec3e85b394f?q=80&w=2082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    this.bio = data.bio
    this.xp = data.xp || 0
    this.totalExperience = data.totalExperience || 0
    this.reputation = data.reputation || 0
    this.rank = data.rank || 0
    this.title = data.title
  }
}
