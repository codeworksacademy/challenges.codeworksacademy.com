import { AppState } from '../AppState'
import { Account } from '../models/Account.js'
import { ChallengeParticipant } from "../models/ChallengeParticipant.js"
import { logger } from '../utils/Logger'
import { api } from './AxiosService'

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
        this.getMyParticipations(),
        this.calculateAccountRank(),
        this.calculateReputation()
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

  async getMyParticipations() {
    const res = await api.get('/account/participations')
    AppState.AccountState.participations = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[GET PARTICIPANTS BY ACCOUNT]', AppState.AccountState.participations)
  }

  async calculateAccountRank() {
    const res = await api.get('/account/rank')
    logger.log('[CURRENT ACCOUNT RANK]', res.data)
    AppState.AccountState.account.rank = res.data
    return res.data
  }

  async calculateReputation() {
    const res = await api.get('account/reputation')
    AppState.AccountState.account.reputation = res.data.reputation

    logger.log('[CURRENT ACCOUNT REPUTATION]', res.data)
  }

}

export const accountService = new AccountService()
