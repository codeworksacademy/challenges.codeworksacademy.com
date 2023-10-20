import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { answersService } from "../services/AnswersService.js";

export class AnswersController extends BaseController{
  constructor(){
    super('api/answers')
    this.router

    .use(Auth0Provider.getAuthorizedUserInfo)

    .post('', this.createAnswer)
    .delete('/:answerId', this.removeAnswer)
  }

  async createAnswer(req, res, next) {
    try {
      const answerData = req.body

      answerData.creatorId = req.userInfo.id

      const answer = await answersService.createAnswer(answerData)

      return res.send(answer)
    } catch (error) {
      next(error)
    }
  }

  removeAnswer(arg0, removeAnswer) {
    throw new Error("Method not implemented.");
  }
}