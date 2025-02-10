import { RANK_VALUES } from '../constants/index.js';
import { dbContext } from '../db/DbContext';
import { accountMilestonesService } from './AccountMilestonesService.js';

class AccountService {
  async getAccount(user) {
    let account = await dbContext.Account.findOne({ _id: user.id || user._id });
    account = await this.createAccountIfNeeded(account, user);
    await this.mergeSubsIfNeeded(account, user);
    return account;
  }

  async createAccountIfNeeded(account, user) {
    if (!account) {
      user._id = user.id;
      if (typeof user.name === 'string' && user.name.includes('@')) {
        user.name = user.nickname;
      }
      account = await dbContext.Account.create({
        ...user,
        subs: [user.sub],
      });
    }
    return account;
  }

  async mergeSubsIfNeeded(account, user) {
    if (!account.subs.includes(user.sub) && user.sub != null) {
      account.subs.push(user.sub);
      await account.save();
    }
  }

  sanitizeBody(body) {
    const writable = {
      name: body.name,
      nickname: body.nickname,
      bio: body.bio,
      resume: body.resume,
      github: body.github,
      linkedin: body.linkedin,
      portfolioLink: body.portfolioLink,
      picture: body.picture,
      coverImg: body.coverImg,
    };
    return writable;
  }

  async updateAccount(user, body) {
    const update = this.sanitizeBody(body);
    return await dbContext.Account.findOneAndUpdate(
      { _id: user.id },
      { $set: update },
      { runValidators: true, setDefaultsOnInsert: true, new: true }
    );
  }

  async calculateAccountRank(user, experience = 0) {
    try {
      const account = await this.getAccount(user);
      account.xp += experience;

      const totalMilestoneXp = await accountMilestonesService.getTotalMilestoneExperience(account);
      let rank = account.xp + account.reputation + totalMilestoneXp;

      const nextIndex = RANK_VALUES.findIndex(r => r.RANK_THRESHOLD > rank);
      let rankTitle = RANK_VALUES[nextIndex - 1] || RANK_VALUES.at(-1) || RANK_VALUES[0];

      account.rank = rank;
      account.title = rankTitle.NAME;
      await account.save();

      return account;
    } catch (error) {
      console.error('Error calculating account rank:', error.message);
      throw new Error('Failed to calculate account rank. Please try again.');
    }
  }

  async calculateAccountReputation(user, reputation = 0) {
    try {
      const account = await this.getAccount(user);
      account.reputation += reputation;
      await account.save();
      return account;
    } catch (error) {
      console.error('Error updating account reputation:', error.message);
      throw new Error('Failed to update account reputation. Please try again.');
    }
  }
}

export const accountService = new AccountService();