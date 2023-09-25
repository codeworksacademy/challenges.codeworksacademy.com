import { AppState } from '../AppState.js'
import { logger } from '../utils/Logger'
import { api } from './AxiosService'
import { Event } from '../models/Event'
import Pop from '../utils/Pop'

class EventsService {
  async createEvent(newEvent) {
    logger.log('Creating Event')
    const res = await api.post('/api/events', newEvent)
    logger.log('New Event:', `${newEvent}`)
    AppState.events.unshift(res.data)
    logger.log('New Event:', res.data)
  }

  async getAllEvents() {
    logger.log('Getting Events')
    const res = await api.get('/api/events')
    AppState.events = res.data.map(e => new Event(e))
    logger.log('Events:', AppState.events)
  }

  async setActiveEvent(eventId) {
    const res = await api.get(`/api/events/${eventId}`)
    AppState.activeEvent = res.data
    logger.log('Active Event:', AppState.activeEvent)
  }

  async cancelEvent(eventId) {
    const res = await api.delete(`/api/events/${eventId}`)
    logger.log('Cancelling Event ⏩', res.data)
    let indexToCancel = AppState.events.findIndex(e => e.id == eventId)
    AppState.events.splice(indexToCancel, 1)
    Pop.toast('You have cancelled your event.', 'success')
  }

  async deleteEvent(eventId) {
    const res = await api.delete(`/api/events/${eventId}`)
    logger.log('Deleting Event ⏩', res.data)
    let foundEvent = AppState.events.find(e => e.id == eventId)
    AppState.events.splice(foundEvent, 1)
    Pop.toast('You have successfully deleted this event!', 'success')
  }

  async completeEvent(eventId, userId){
    //Add user to list of users that have completed the event
    //Go into stats service to award awards, points, calculate leaderboard position
  }
}

export const eventsService = new EventsService()