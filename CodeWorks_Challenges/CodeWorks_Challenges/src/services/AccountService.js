import { dbContext } from '../db/DbContext'
import { accountMilestonesService } from "./AccountMilestonesService.js"
import { challengesService } from './ChallengesService.js'

// Private Methods

/**
 * Creates account if one does not exist
 * @param {any} account
 * @param {any} user
 */
async function createAccountIfNeeded(account, user) {
  if (!account) {
    user._id = user.id
    if (typeof user.name == 'string' && user.name.includes('@')) {
      user.name = user.nickname
    }
    account = await dbContext.Account.create({
      ...user,
      subs: [user.sub]
    })
  }
  return account
}

/**
 * Adds sub to account if not already on account
 * @param {any} account
 * @param {any} user
 */
async function mergeSubsIfNeeded(account, user) {
  if (!account.subs.includes(user.sub)) {
    // @ts-ignore
    account.subs.push(user.sub)
    await account.save()
  }
}
/**
 * Restricts changes to the body of the account object
 * @param {any} body
 */
function sanitizeBody(body) {
  const writable = {
    name: body.name,
    picture: body.picture,
    coverImg: body.coverImg,
    aboutContent: body.aboutContent,
    reputation: body.reputation,
  }
  return writable
}

class AccountService {
  /**
   * Returns a user account from the Auth0 user object
   *
   * Creates user if none exists
   *
   * Adds sub of Auth0 account to account if not currently on account
   * @param {any} user
   */
  async getAccount(user) {
    let account = await dbContext.Account.findOne({
      _id: user.id
    })
    account = await createAccountIfNeeded(account, user)
    await mergeSubsIfNeeded(account, user)
    return account
  }

  /**
   * Updates account with the request body, will only allow changes to editable fields
   *  @param {any} user Auth0 user object
   *  @param {any} body Updates to apply to user object
   */
  async updateAccount(user, body) {
    const update = sanitizeBody(body)
    const account = await dbContext.Account.findOneAndUpdate(
      { _id: user.id },
      { $set: update },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    return account
  }

  // Increments the experience of the user based on the difficulty of challenges they have completed
  async increaseMyExperienceByChallengeDifficulty(user, challengeDifficulty) {
    if (challengeDifficulty < 0 || challengeDifficulty > 1000) {
      throw new Error('You must supply a number, with value between 1-999')
    }
    const update = await this.getAccount(user)
    update.experience = update.experience += challengeDifficulty;

    const totalMilestoneExperience = await accountMilestonesService.getTotalMilestoneExperience(update)
    update.totalExperience = update.experience + totalMilestoneExperience
    const account = await this.updateAccount(user, update)

    const accountToBeReturned = {
      name: account.name,
      id: account.id,
      experience: account.experience,
      reputation: account.reputation,
      totalExperience: account.totalExperience,
      rank: account.rank
    }

    return accountToBeReturned
  }

  // Calculates the rank of the user by adding the following to the user's XP and reputation, which both contribute to increasing user rank => original XP level + total milestone XP from user's milestones + reputation
  async calculateMyRank(user) {
    const update = await this.getAccount(user)

    const totalMilestoneExperience = await accountMilestonesService.getTotalMilestoneExperience(update)

    let totalExperience = update.experience + totalMilestoneExperience

    const updateToBeReturned = {
      ...update,
      totalExperience: totalExperience,
      rank: totalExperience + update.reputation
    }

    await this.updateAccount(user, updateToBeReturned)

    return updateToBeReturned
  }

  // Calculates the reputation of the user
  async calculateMyReputation(userInfo) {
    const challenges = await challengesService.getChallengesCreatedBy(userInfo.id, userInfo.id)
    const account = await this.getAccount(userInfo)
    let reputationScore = account.reputation += 0

    if (challenges.creatorId === userInfo.id) {
      reputationScore += 1
    }
    challenges.forEach(c => reputationScore === c.reputationIds.length)
    const newReputation = challenges.reduce((acc, curr) => acc + curr.reputationIds.length, 0)
    account.reputation = newReputation

    if(account.reputation != reputationScore){
      await this.updateMyReputation(userInfo, reputationScore)
    }

    return account
  }

  // Updates the reputation of the user
  async updateMyReputation(user, body){
    const account = await this.getAccount(user)

    account.reputation = body >= 0 ? body : account.reputation

    await account.save()
  }
}
export const accountService = new AccountService()