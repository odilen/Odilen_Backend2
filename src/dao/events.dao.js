import Event from '../models/event.model.js'

class EventsDao {
  async getAllEvents(
    filters = {},
    page = 1,
    limit = 10,
    sort = { date: 1 }
  ) {
    const skip = (page - 1) * limit

    const events = await Event.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Event.countDocuments(filters)

    return {
      events,
      total
    }
  }

  async createEvent(eventData) {
    const event = new Event(eventData)

    return await event.save()
  }

  async getEventById(id) {
    return await Event.findById(id)
  }

  async updateEvent(id, eventData) {
    return await Event.findByIdAndUpdate(
      id,
      eventData,
      {
        new: true,
        runValidators: true
      }
    )
  }
}

export default new EventsDao()