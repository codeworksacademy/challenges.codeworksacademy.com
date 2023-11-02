
import { api } from './AxiosService'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { Submission } from '../models/Submission'

class SubmissionsService {
  async createSubmission(newSubmission) {
    const res = await api.post('/api/submissions', newSubmission)
    logger.log('Creating Submission ⏩', res.data)
    AppState.submissions.push(new Submission(res.data))
  }
}

export const submissionsService = new SubmissionsService()