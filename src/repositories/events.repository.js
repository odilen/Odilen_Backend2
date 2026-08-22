import eventsDAO from '../dao/events.dao.js'

class EventsRepository {
  async getAll() {
    return await eventsDAO.getAllEvents()
  }

  async create(eventData) {
    return await eventsDAO.createEvent(eventData)
  }
  async getById(id) {
  return await eventsDAO.getEventById(id)
}

async update(id, eventData) {
  return await eventsDAO.updateEvent(id, eventData)
}
}

export default new EventsRepository()
