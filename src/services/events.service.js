import eventsRepository from '../repositories/events.repository.js'
import { ValidationError } from '../utils/errors.js'

class EventsService {
  async getAllEvents() {
    return await eventsRepository.getAll()
  }

  async createEvent(payload) {
    const { title, date, location, organizerEmail, description, capacity } = payload || {}

    if (!title || !date || !location || !organizerEmail) {
      const err = new ValidationError('title, date, location y organizerEmail son obligatorios')
      throw err
    }

    const eventDate = new Date(date)
    if (Number.isNaN(eventDate.getTime())) {
      throw new ValidationError('La fecha del evento no es válida')
    }

    const newEvent = await eventsRepository.create({
      title,
      description: description || '',
      date: eventDate,
      location,
      organizerEmail,
      capacity: Number(capacity) || 0
    })

    return newEvent.toObject ? newEvent.toObject() : newEvent
  }
  async updateEvent(id, eventData) {
    const event = await eventsRepository.update(id, eventData)

    return event
  }
  async getEventById(id) {
    return await eventsRepository.getById(id)
  }
}

export default new EventsService()
