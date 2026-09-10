import ticketsDAO from '../dao/tickets.dao.js'

class TicketsRepository {
  async create(ticketData) {
    return await ticketsDAO.createTicket(ticketData)
  }

  async getActiveByUserAndEvent(userId, eventId) {
    return await ticketsDAO.getActiveTicket(
      userId,
      eventId
    )
  }

  async countActiveTickets(eventId) {
    return await ticketsDAO.getReservedQuantity(eventId)
  }

  async getByUser(userId) {
    return await ticketsDAO.getTicketsByUser(userId)
  }

  async getByEvent(eventId) {
    return await ticketsDAO.getTicketsByEvent(eventId)
  }

  async getById(id) {
    return await ticketsDAO.getTicketById(id)
  }

  async update(id, ticketData) {
    return await ticketsDAO.updateTicket(
      id,
      ticketData
    )
  }
}

export default new TicketsRepository()