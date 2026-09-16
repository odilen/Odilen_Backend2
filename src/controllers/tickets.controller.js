import ticketsService from '../services/tickets.service.js'
import { ticketDTO } from '../dto/ticket.dto.js'

export const createTicket = async (req, res, next) => {
  try {
    const result = await ticketsService.createTicket(
      req.params.eid,
      req.user,
      req.body.quantity
    )

    const message = result.emailSent
      ? 'Inscripción realizada y correo de confirmación enviado'
      : 'Inscripción realizada, pero no se pudo enviar el correo de confirmación'

    return res.status(201).json({
      status: 'success',
      message,
      emailSent: result.emailSent,
      payload: ticketDTO(result.ticket)
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
    const tickets = await ticketsService.getEventTickets(
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
    const cancelledTicket = await ticketsService.cancelTicket(
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