import eventsService from '../services/events.service.js'

export const getEvents = async (req, res) => {
  try {
    const events = await eventsService.getAllEvents()
    return res.json(events)
  } catch (error) {
    console.error('Error al obtener eventos:', error)
    return res.status(500).json({ error: 'Error al obtener eventos' })
  }
}

export const createEvent = async (req, res) => {
  try {
    const newEvent = await eventsService.createEvent(req.body)
    return res.status(201).json(newEvent)
  } catch (error) {
    console.error('Error al crear evento:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Error al crear evento' })
  }
}
