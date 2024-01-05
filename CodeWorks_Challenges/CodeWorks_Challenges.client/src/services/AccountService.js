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
    } catch (err) {
      logger.error('HAVE YOU STARTED YOUR SERVER YET???', err)
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
      AppState.myChallenges = res.data
      logger.log('Challenges I created:', AppState.myChallenges)
    } catch (error) {
      logger.error(error)
    }
  }

  async getMyParticipations() {
    const res = await api.get('/account/participations')
    AppState.myParticipants = res.data.map(p => new ChallengeParticipant(p))
    logger.log('[GET PARTICIPANTS BY ACCOUNT]', AppState.myParticipants)
  }

  async calculateAccountRank() {
    const res = await api.get('/account/rank')
    logger.log('[CURRENT ACCOUNT RANK]', res.data)
    AppState.AccountState.account.rank = res.data.rank
    return res.data
  }

  async calculateReputation(){
    const res = await api.get('account/reputation')
    AppState.AccountState.account.reputation = res.data.reputation

    logger.log('[CURRENT ACCOUNT REPUTATION]', res.data)
  }

  clearSharedVariables(){
    AppState.moderations = []
  }
}

export const accountService = new AccountService()
