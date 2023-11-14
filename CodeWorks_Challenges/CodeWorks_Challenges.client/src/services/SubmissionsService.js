
import { api } from './AxiosService'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { Submission } from '../models/Submission'
import { Challenge } from '../models/Challenge'
import { challengesService } from './ChallengesService'

class SubmissionsService {
  async createSubmission(newSubmission) {
    const res = await api.post('/api/submissions', newSubmission)
    logger.log('Creating Submission ⏩', res.data)
    AppState.activeSubmission = res.data
    return res.data
  }

  
}

export const submissionsService = new SubmissionsService()