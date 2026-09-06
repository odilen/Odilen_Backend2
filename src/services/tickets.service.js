import { randomUUID } from 'node:crypto'

import ticketsRepository from '../repositories/tickets.repository.js'
import eventsRepository from '../repositories/events.repository.js'
import {
  ValidationError,
  ForbiddenError,
  NotFoundError
} from '../utils/errors.js'
import mailService from './mail.service.js'

class TicketsService {
  async createTicket(eventId, user, quantity) {
    const event = await eventsRepository.getById(eventId)

    if (!event) {
      throw new NotFoundError('Evento no encontrado')
    }

    if (
      event.status === 'cancelled' ||
      event.status === 'finished'
    ) {
      throw new ValidationError(
        'No podés inscribirte a un evento cancelado o finalizado'
      )
    }

    if (event.status !== 'published') {
      throw new ValidationError(
        'El evento no está publicado'
      )
    }

    if (event.date <= new Date()) {
      throw new ValidationError(
        'El evento ya finalizó'
      )
    }

    const quantityNumber = Number(quantity)

    if (
      !Number.isInteger(quantityNumber) ||
      quantityNumber <= 0
    ) {
      throw new ValidationError(
        'La cantidad debe ser un número entero mayor que 0'
      )
    }

    const activeTicket =
      await ticketsRepository.getActiveByUserAndEvent(
        user.id,
        eventId
      )

    if (activeTicket) {
      throw new ValidationError(
        'Ya tenés una inscripción activa para este evento'
      )
    }

    const reservedQuantity =
      await ticketsRepository.getReservedQuantity(eventId)

    const availableQuantity =
      event.capacity - reservedQuantity

    if (availableQuantity < quantityNumber) {
      throw new ValidationError(
        `No hay cupos suficientes. Cupos disponibles: ${availableQuantity}`
      )
    }

    const reservationCode = randomUUID()

    const ticket = await ticketsRepository.create({
      user: user.id,
      event: eventId,
      quantity: quantityNumber,
      status: 'confirmed',
      reservationCode
    })

    await mailService.sendTicketConfirmation(
      user.email,
      event,
      ticket
    )

    return ticket
  }
  async getMyTickets(user) {
    return await ticketsRepository.getByUser(user.id)
  }

  async getEventTickets(eventId, user) {
    const event = await eventsRepository.getById(eventId)

    if (!event) {
      throw new NotFoundError('Evento no encontrado')
    }

    const isAdmin = user.role === 'admin'

    const isOwner =
      event.organizer.toString() === user.id.toString()

    if (!isAdmin && !isOwner) {
      throw new ForbiddenError(
        'Solo podés consultar los tickets de tus propios eventos'
      )
    }

    return await ticketsRepository.getByEvent(eventId)
  }
    async cancelTicket(ticketId, user) {
    const ticket = await ticketsRepository.getById(
      ticketId
    )

    if (!ticket) {
      throw new NotFoundError('Ticket no encontrado')
    }

    const isAdmin = user.role === 'admin'

    const isOwner =
      ticket.user.toString() === user.id.toString()

    if (!isAdmin && !isOwner) {
      throw new ForbiddenError(
        'No podés cancelar el ticket de otro usuario'
      )
    }

    if (ticket.status === 'cancelled') {
      throw new ValidationError(
        'El ticket ya está cancelado'
      )
    }

    return await ticketsRepository.update(
      ticketId,
      {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    )
  }
}

export default new TicketsService()