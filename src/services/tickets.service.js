import { randomUUID } from 'node:crypto'

import ticketsRepository from '../repositories/tickets.repository.js'
import eventsRepository from '../repositories/events.repository.js'
import {
  ValidationError,
  NotFoundError
} from '../utils/errors.js'

class TicketsService {
  async createTicket(eventId, userId, quantity) {
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
        userId,
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

    return await ticketsRepository.create({
      user: userId,
      event: eventId,
      quantity: quantityNumber,
      status: 'confirmed',
      reservationCode
    })
  }
}

export default new TicketsService()