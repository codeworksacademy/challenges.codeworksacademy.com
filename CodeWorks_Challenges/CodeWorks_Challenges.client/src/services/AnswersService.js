import { logger } from "../utils/Logger"
import { api } from "./AxiosService"

class AnswersService {
  // 🚨🚨🚨 Does this whole thing need to be deleted?? 🚨🚨🚨 TRASH
  async createAnswer(answerData) {
    const res = await api.post('api/answers', answerData)

    logger.log('[CREATING ANSWER]', res.data)
  }

  async getAnswersByChallengeId(challengeId) {
    const res = await api.get(`api/challenges/${challengeId}/answers`)

    logger.log('[GETTING CHALLENGE ANSWERS]', res.data)
  }
}

export const answersService = new AnswersService()