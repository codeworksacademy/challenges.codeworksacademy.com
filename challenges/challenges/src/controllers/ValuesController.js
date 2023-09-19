import { Auth0Provider } from '@bcwdev/auth0provider'
import { valuesService } from '../services/ValuesService.js'
import BaseController from '../utils/BaseController'

export class ValuesController extends BaseController {
  constructor() {
    super('api/values')
    this.router
      .get('', this.getAll)
      // NOTE If there is an authenticated user it will attach here otherwise allows through
      .get('/:id', Auth0Provider.tryAttachUserInfo, this.getOneValue)
      // NOTE: Beyond this point all routes require Authorization tokens (the user must be logged in)
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
  }

  /**
   * Sends all values back to the client
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  async getAll(request, response, next) {
    try {
      response.send(['value1', 'value2'])
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a single value by its id or error, back to the client
   * @param {import("express").Request} request
   * @param {import("express").Response} response
   * @param {import("express").NextFunction} next
   */
  async getOneValue(request, response, next) {
    try {
      const value = valuesService.findById(request.params.id)
      response.send(value)
    } catch (error) {
      next(error)
    }
  }

  async create(request, response, next) {
    try {
      // NOTE NEVER TRUST THE CLIENT TO ADD THE CREATOR ID
      request.body.creatorId = request.userInfo.id

      response.send(request.body)
    } catch (error) {
      next(error)
    }
  }
}



