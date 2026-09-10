import eventsService from '../services/events.service.js'
import { eventDTO } from '../dto/event.dto.js'

export const getEvents = async (req, res, next) => {
  try {
    const result = await eventsService.getAllEvents(
      req.query
    )

    return res.status(200).json({
      ...result,
      data: result.data.map(event => eventDTO(event))
    })
  } catch (error) {
    next(error)
  }
}

export const getEventById = async (req, res, next) => {
  try {
    const event = await eventsService.getEventById(
      req.params.id
    )

    return res.status(200).json({
      status: 'success',
      data: eventDTO(event)
    })
  } catch (error) {
    next(error)
  }
}

export const createEvent = async (req, res, next) => {
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
    next(error)
  }
}

export const updateEvent = async (req, res, next) => {
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
    next(error)
  }
}

export const updateEventStatus = async (req, res, next) => {
  try {
    const updatedEvent =
      await eventsService.updateEventStatus(
        req.params.id,
        req.body.status,
        req.user
      )

    return res.status(200).json({
      status: 'success',
      data: eventDTO(updatedEvent)
    })
  } catch (error) {
    next(error)
  }
}