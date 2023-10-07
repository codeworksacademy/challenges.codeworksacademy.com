import { AppState } from '../AppState'
import { Account } from '../models/Account.js'
import { logger } from '../utils/Logger'
import Pop from "../utils/Pop.js"
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
}

export const accountService = new AccountService()
