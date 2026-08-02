import Event from '../models/event.model.js'

class EventsDao {
  async getAllEvents() {
    return await Event.find().sort({ date: 1 }).lean()
  }

  async createEvent(eventData) {
    const event = new Event(eventData)
    return await event.save()
  }
}

export default new EventsDao()
