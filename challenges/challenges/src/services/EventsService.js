import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";
import { accountService } from "./AccountService.js";

class EventsService {
  async createEvent(newEvent) {
    const event = await dbContext.Events.create(newEvent)
    await event.populate('creator', 'name picture')
    return event
  }

  async getAllEvents() {
    const events = await dbContext.Events.find().populate('creator')
    .sort({ eventDate: -1 })
    return events
  }

  async getEventById(eventId) {
    const event = await dbContext.Events.findById(eventId)
    .populate('creator', 'name picture')
    if (!event) {
      throw new BadRequest("Invalid Event Id")
    }
    return event
  }

  async cancelEvent(eventId, userId) {
    const event = await this.getEventById(eventId)
    if (event.creatorId != userId) {
      throw new Forbidden(
        `[PERMISSIONS ERROR]: You are not the creator of ${event.name}, therefore you cannot cancel it.`
      )
    }
    event.isCancelled = !event.isCancelled
    await event.save()
    return event
  }

  async deleteEvent(eventId, userId) {
    const event = await this.getEventById(eventId)
    if  (event.creatorId != userId)
      throw new Forbidden(
        `[PERMISSIONS ERROR]: You are not the creator of ${event.name}, therefore you cannot delete it.`
      )
    event.remove()
    return event
  }
}

export const eventsService = new EventsService()