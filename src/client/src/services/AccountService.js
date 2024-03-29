import { api } from './AxiosService'
import { AppState } from '../AppState.js'
import { logger } from '../utils/Logger.js'
import { Account } from '../models/Account.js'
import { Challenge } from "../models/Challenge.js"
import { ChallengeModerator } from "../models/ChallengeModerator.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"

class AccountService {
  async getAccount() {
    try {
      const res = await api.get('/account');
      AppState.AccountState.account = new Account(res.data);
    } catch (err) {
      logger.error('HAVE YOU STARTED YOUR SERVER YET???', err);
    }
  }

  async getAccountData() {
    try {
      await Promise.allSettled([
        this.getMyChallenges(),
        this.getMyParticipation(),
        this.getMyModerations(),
        this.getMyChallengeModerators(),
      ])
    } catch (error) {
      // TODO - figure out repeat calls
      logger.error('[ACCOUNT SERVICE] getAccountData', error);
    }
  }

  async getMyChallenges() {
    const res = await api.get('/account/challenges');
    AppState.AccountState.challenges = res.data.map(c => new Challenge(c));
    logger.log('[ACCOUNT SERVICE] getMyChallenges:', AppState.AccountState.challenges);
  }

  async getMyParticipation() {
    const res = await api.get('/account/participation');
    AppState.AccountState.participation = res.data.map(p => new ChallengeParticipant(p));
    logger.log('[ACCOUNT SERVICE] getMyParticipation', AppState.AccountState.participation);
  }

  async getMyModerations() {
    const res = await api.get('/account/myModerations');
    AppState.AccountState.moderation = res.data.map(m => new ChallengeModerator(m));
    logger.log('[ACCOUNT SERVICE] getMyModerations', res.data, '[AS]', AppState.AccountState.moderation);
  }

  async getMyChallengeModerators() {
    const res = await api.get(`/account/challengeModerators`);
    logger.log('[ACCOUNT SERVICE] getMyChallengeModerators', res.data);
    AppState.AccountState.challengeModerations = res.data.map(m => new ChallengeModerator(m));
  }

}

export const accountService = new AccountService();
