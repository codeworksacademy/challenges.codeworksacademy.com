import { AppState } from '../AppState'
import { Account } from '../models/Account.js'
import { Participant } from "../models/Participant.js"
import { logger } from '../utils/Logger'
import { api } from './AxiosService'

class AccountService {
  async getAccount() {
    try {
      const res = await api.get('/account')
      AppState.account = new Account(res.data)
    } catch (err) {
      logger.error('HAVE YOU STARTED YOUR SERVER YET???', err)
    }
  }

  async updateAccount(formData) {
    const res = await api.put('/account', formData)
    logger.log(res.data)
    AppState.account = new Account(res.data)
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
    AppState.myParticipants = res.data.map(p => new Participant(p))
    logger.log('[GET PARTICIPANTS BY ACCOUNT]', AppState.myParticipants)
  }

  async calculateAccountRank() {
    const res = await api.get('/account/rank')
    AppState.account.rank = res.data.rank
  }
}

export const accountService = new AccountService()
