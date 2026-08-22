import Event from '../models/event.model.js'

class EventsDao {
  async getAllEvents() {
    return await Event.find().sort({ date: 1 }).lean()
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
      { new: true }
    )
  }
}

export default new EventsDao()