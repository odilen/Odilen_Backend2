import eventsService from '../services/events.service.js'

export const getEvents = async (req, res) => {
  try {
    const events = await eventsService.getAllEvents()

    return res.status(200).json({
      status: 'success',
      payload: events
    })
  } catch (error) {
    console.error('Error al obtener eventos:', error)

    return res.status(500).json({
      status: 'error',
      error: 'Error al obtener eventos'
    })
  }
}

export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizerEmail: req.user.email
    }

    const newEvent = await eventsService.createEvent(eventData)

    return res.status(201).json({
      status: 'success',
      payload: newEvent
    })
  } catch (error) {
    console.error('Error al crear evento:', error)

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: error.message
      })
    }

    return res.status(500).json({
      status: 'error',
      message: 'Error al crear evento'
    })
  }
}
export const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id

    const event = await eventsService.getEventById(eventId)

    if (!event) {
      return res.status(404).json({
        status: 'error',
        message: 'Evento no encontrado'
      })
    }

    if (
      req.user.role === 'organizer' &&
      event.organizerEmail !== req.user.email
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Solo podés modificar tus propios eventos'
      })
    }

    const eventData = {
      ...req.body,
      organizerEmail: event.organizerEmail
    }

    const updatedEvent = await eventsService.updateEvent(
      eventId,
      eventData
    )

    return res.status(200).json({
      status: 'success',
      payload: updatedEvent
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al modificar evento'
    })
  }
}
