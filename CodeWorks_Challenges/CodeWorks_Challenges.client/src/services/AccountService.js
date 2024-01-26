import { AppState } from '../AppState'
import { Account } from '../models/Account.js'
import { ChallengeModerator } from "../models/ChallengeModerator.js"
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"
import { logger } from '../utils/Logger'
import { api } from './AxiosService'
import { challengeModeratorsService } from "./ChallengeModeratorsService.js"

class AccountService {
  async getAccount() {
    try {
      const res = await api.get('/account')
      AppState.AccountState.account = new Account(res.data)

      this.getAccountData()

    } catch (err) {
      logger.error('HAVE YOU STARTED YOUR SERVER YET???', err)
    }
  }

  async getAccountData() {
    try {
      await Promise.all([
        this.getMyChallenges(),
        this.getMyParticipation(),
        this.getMyModerations(),
        this.getMyChallengeModeration()
      ])
    } catch (error) {
      // todo figure out repeat calls
      logger.error(error)
    }
  }

  async updateAccount(formData) {
    const res = await api.put('/account', formData)
    logger.log(res.data)
    AppState.AccountState.account = new Account(res.data)
    return res.data
  }

  async getMyChallenges() {
    try {
      const res = await api.get('/account/challenges')
      AppState.AccountState.challenges = res.data
      logger.log('Challenges I created:', AppState.AccountState.challenges)
    } catch (error) {
      logger.error(error)
    }
  }

  async getMyParticipation() {
    const res = await api.get('/account/participation')
    AppState.AccountState.participation = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[GET PARTICIPANTS BY ACCOUNT]', AppState.AccountState.participation)
  }

  async getMyModerations() {
    const res = await api.get('/account/moderation')
    AppState.AccountState.moderation = res.data.map(m => new ChallengeModerator(m))
    logger.log('[GET MODERATIONS BY ACCOUNT]', res.data, '[AS]', AppState.AccountState.moderation)
  }

  async getMyChallengeModeration() {
    const res = await api.get(`/account/challengeModeration`)
    logger.log('[MODERATIONS BY CHALLENGEID]', res.data)
    AppState.AccountState.challengeModeration = res.data.map(m => new ChallengeModerator(m))
  }
}

export const accountService = new AccountService()
