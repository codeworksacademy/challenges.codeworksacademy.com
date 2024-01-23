import { RANK_BADGE } from '../constants/index.js'
import { dbContext } from '../db/DbContext'
import { accountMilestonesService } from "./AccountMilestonesService.js"
import { challengesService } from './ChallengesService.js'
import { participantsService } from "./ParticipantsService.js"

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
  // Properties that the user can change about their own account
  const writable = {
    name: body.name,
    picture: body.picture,
    coverImg: body.coverImg,
    aboutContent: body.aboutContent,
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
      _id: user.id || user._id
    }).populate('badges')
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


  // Calculates the rank of the user by adding the following to the user's XP and reputation, which both contribute to increasing user rank => original XP level + total milestone XP from user's milestones + reputation
  /**
   * 
   * @param {{id:string}} user 
   * @returns 
   */

  //FIXME - Chantha check out the title enums
  async calculateAccountRank(user, experience = 0) {
    const update = await this.getAccount(user)

    const totalMilestoneExperience = await accountMilestonesService.getTotalMilestoneExperience(account)
    account.experience += experience

    let rank = account.experience + totalMilestoneExperience + account.reputation

    const nextI = RANK_BADGE.findIndex(b => b.RANK_THRESHOLD > rank)
    let badge = RANK_BADGE[nextI - 1]
    if (nextI == -1) {
      badge = RANK_BADGE.at(-1)
    }
    if (!badge) {
      badge = RANK_BADGE[0]
    }

    account.rank = rank
    account.title = RANK_BADGE[nextI - 1].NAME
    await account.save()
    return account
  }

  async calculateAccountReputation(user, reputation = 0) {
    const account = await this.getAccount(user)
    account.reputation += reputation
    await account.save()
    return account
  }
}
export const accountService = new AccountService()