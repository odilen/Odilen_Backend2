import eventsService from '../services/events.service.js'
import { eventDTO } from '../dto/event.dto.js'

const sendErrorResponse = (
  res,
  error,
  defaultMessage
) => {
  console.error(defaultMessage, error)

  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'El ID del evento no es válido'
    })
  }

  return res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || defaultMessage
  })
}

export const getEvents = async (req, res) => {
  try {
    const result = await eventsService.getAllEvents(
      req.query
    )

    return res.status(200).json({
      ...result,
      data: result.data.map(event => eventDTO(event))
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al obtener eventos'
    )
  }
}

export const getEventById = async (req, res) => {
  try {
    const event = await eventsService.getEventById(
      req.params.id
    )

    return res.status(200).json({
      status: 'success',
      data: eventDTO(event)
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al obtener el evento'
    )
  }
}

export const createEvent = async (req, res) => {
  try {
    const newEvent = await eventsService.createEvent(
      req.body,
      req.user.id
    )

    return res.status(201).json({
      status: 'success',
      data: eventDTO(newEvent)
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al crear el evento'
    )
  }
}

export const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventsService.updateEvent(
      req.params.id,
      req.body,
      req.user
    )

    return res.status(200).json({
      status: 'success',
      data: eventDTO(updatedEvent)
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al modificar el evento'
    )
  }
}

export const updateEventStatus = async (req, res) => {
  try {
    const updatedEvent =
      await eventsService.updateEventStatus(
        req.params.id,
        req.body.status,
        req.user
      )

    return res.status(200).json({
      status: 'success',
      data: updatedEvent
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al cambiar el estado del evento'
    )
  }
}