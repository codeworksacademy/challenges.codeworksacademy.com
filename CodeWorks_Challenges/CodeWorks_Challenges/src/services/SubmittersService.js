import { dbContext } from '../db/DbContext.js'

// IMPORTANT submitters should not be updated or modified in any way here. Use the SubmissionsService

class SubmittersService {
  /**
    * Returns a user profile from its id
    * @param {string} id
   */
  async getSubmitterById(id) {
    const profile = await dbContext.Submissions.findById(id)
    return profile
  }

  /**
    * Returns a list user submissions from a query search of name likeness
    * limits to first 20 without offset
    * @param {string} name
   */
  async findSubmitters(name = '', offset = 0) {
    const filter = new RegExp(name, 'ig')
    return await dbContext.Submissions
      .aggregate([{
        $match: { name: filter }
      }])
      .collation({ locale: 'en_US', strength: 1 })
      .skip(Number(offset))
      .limit(20)
      .exec()
  }
}

export const submittersService = new SubmittersService()
