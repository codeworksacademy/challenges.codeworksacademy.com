export class Profile {
  constructor(data) {
    this.id = data._id
    this.name = data.name.charAt(0).toUpperCase() + data.name.slice(1) || 'Anonymous'
    this.picture = data.picture
    this.coverImg = data.coverImg || 'https://images.unsplash.com/photo-1484820986637-7ec3e85b394f?q=80&w=2082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    this.xp = data.xp
    this.reputation = data.reputation
    this.rank = data.rank
    this.title = data.title
  }
}