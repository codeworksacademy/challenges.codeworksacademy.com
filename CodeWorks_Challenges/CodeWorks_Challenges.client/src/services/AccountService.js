import { AppState } from '../AppState'
import { Account } from '../models/Account.js'
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

  async getMyChallenges() {
    try {
      const res = await api.get('/account/challenges')
      AppState.myChallenges = res.data
      logger.log('Challenges I created:', AppState.myChallenges)
    } catch (error) {
      logger.error(error)
    }
  }

  async getMyParticipants() {
    try {
      const res = await api.get('/account/participants')
      AppState.myParticipants = res.data
      logger.log('Participants in my challenges:', AppState.myParticipants)
    } catch (error) {
      logger.error(error)
    }
  }
}

export const accountService = new AccountService()
