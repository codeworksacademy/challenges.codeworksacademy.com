import { dbContext } from '../db/DbContext'
import { accountMilestonesService } from "./AccountMilestonesService.js"

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
    aboutContent: body.aboutContent
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
  async increaseAccountExperienceByChallengeDifficulty(user, challengeDifficulty) {
    if (challengeDifficulty != Number && (challengeDifficulty < 0 || challengeDifficulty > 1000)) {
      new Error('You must supply a number, with value between 1-999')
    }

    const update = await this.getAccount(user)
    update.experience = update.experience += challengeDifficulty;

    const account = await dbContext.Account.findOneAndUpdate(
      { _id: user.id },
      { $set: update },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    const accountToBeReturned = {}
    accountToBeReturned.id = account.id
    accountToBeReturned.experience = account.experience
    accountToBeReturned.name = account.name
    return accountToBeReturned
  }

  async calculateAccountRank(user) {
    const update = await this.getAccount(user)

    const totalMilestoneExperience = await accountMilestonesService.getTotalMilestoneExperience(user)

    let totalExperience = update.experience + totalMilestoneExperience

    update.totalExperience = totalExperience
    update.rank = totalExperience + update.reputation

    const account = await dbContext.Account.findOneAndUpdate(
      { _id: user.id },
      { $set: update },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    )
    return account;
  }
}
export const accountService = new AccountService()
