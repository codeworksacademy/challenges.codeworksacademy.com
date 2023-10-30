import BaseController from "../utils/BaseController.js"
import { Auth0Provider } from "@bcwdev/auth0provider";

export class MilestonesController extends BaseController {
  constructor() {
    super('api/milestones')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
  }
}