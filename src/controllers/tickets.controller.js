import ticketsService from '../services/tickets.service.js'
import { ticketDTO } from '../dto/ticket.dto.js'

export const createTicket = async (req, res, next) => {
  try {
    const newTicket = await ticketsService.createTicket(
      req.params.eid,
      req.user,
      req.body.quantity
    )

    return res.status(201).json({
      status: 'success',
      message: 'Inscripción realizada correctamente',
      data: ticketDTO(newTicket)
    })
  } catch (error) {
    next(error)
  }
}

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketsService.getMyTickets(
      req.user.id
    )

    return res.status(200).json({
      status: 'success',
      data: tickets.map(ticket => ticketDTO(ticket))
    })
  } catch (error) {
    next(error)
  }
}

export const getEventTickets = async (req, res, next) => {
  try {
    const tickets =
      await ticketsService.getEventTickets(
        req.params.eid,
        req.user
      )

    return res.status(200).json({
      status: 'success',
      data: tickets.map(ticket => ticketDTO(ticket))
    })
  } catch (error) {
    next(error)
  }
}

export const cancelTicket = async (req, res, next) => {
  try {
    const cancelledTicket =
      await ticketsService.cancelTicket(
        req.params.tid,
        req.user
      )

    return res.status(200).json({
      status: 'success',
      message: 'Inscripción cancelada correctamente',
      data: ticketDTO(cancelledTicket)
    })
  } catch (error) {
    next(error)
  }
}