import eventsDAO from '../dao/events.dao.js'

class EventsRepository {
  async getAll(filters, page, limit, sort) {
    return await eventsDAO.getAllEvents(
      filters,
      page,
      limit,
      sort
    )
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
  async getPublishedEvents(page, limit, sort) {
    return await eventsDAO.getAllEvents(
      { status: 'published' },
      page,
      limit,
      sort
    )
  }
}

export default new EventsRepository()