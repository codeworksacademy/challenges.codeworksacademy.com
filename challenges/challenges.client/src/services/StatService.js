/** 
 * export class Account {
  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.name = data.name
    this.alias = data.alias
    this.age = data.age
    this.location = data.location
    this.coverImg = data.coverImg
    this.picture = data.picture
    this.bio = data.bio
    this.xpCount = data.xpCount
    this.tributeCount = data.tributeCount
  }
}
*/

/**
 * The goal of the stat service is to:
 * Calculate and update the points, reputation, challenges completed of a user
 * Stats Service is also responsible for the the leaderboard
 */

class StatsService{
    async addPoints(challengeId, userId){
      //Get challenge by ID, add points to a user by completing the challenge
      calculateRank(userId)
    }
    async AddReward(awardId, userId){
      calculateRank(userId)
    }
    async calculateRank(userId){
      
    }
    async resetStats(userId){
      calculateRank(userId)
    }
}

export const statsService = new StatsService();