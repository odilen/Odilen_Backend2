import eventsDAO from '../dao/events.dao.js'

class EventsRepository {
  async getAll() {
    return await eventsDAO.getAllEvents()
  }

  async create(eventData) {
    return await eventsDAO.createEvent(eventData)
  }
}

export default new EventsRepository()
