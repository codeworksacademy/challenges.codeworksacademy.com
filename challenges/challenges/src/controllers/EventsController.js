import { BaseController } from '../utils/BaseController.js'
import { Auth0Provider } from '@bcwdev/auth0provider'
import { eventsService } from '../services/EventsService.js'

export class EventsController extends BaseController {
  constructor() {
    super('api/events')
    this.router
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.createEvent)
      .get('', this.getAllEvents)
      .get('/:eventId', this.getEventById)
      .put('/:eventId', this.cancelEvent)
      .delete('/:eventId', this.deleteEvent)
  }

  async createEvent(req, res, next) {
    try {
      req.body.creatorId = req.userInfo.id
      const event = await eventsService.createEvent(req.body)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }

  async getAllEvents(req, res, next) {
    try {
      const events = await eventsService.getAllEvents()
      return res.send(events)
    } catch (error) {
      next(error)
    }
  }

  async getEventById(req, res, next) {
    try {
      const eventId = req.params.eventId
      const event = await eventsService.getEventById(eventId)
      return res.send(event)
    } catch (error) {
      next(error)
    }
  }

  async cancelEvent(req, res, next) {
    try {
      const eventId = req.params.eventId
      const userId = req.userInfo.id
      await eventsService.cancelEvent(eventId, userId)
      return res.send(eventId)
    } catch (error) {
      next(error)
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const eventId = req.params.eventId
      const userId = req.userInfo.id
      await eventsService.deleteEvent(eventId, userId)
      return res.send(eventId)
    } catch (error) {
      next(error)
    }
  }
}