import Ticket from '../models/ticket.model.js'

class TicketsDao {
  async createTicket(ticketData) {
    const ticket = new Ticket(ticketData)

    return await ticket.save()
  }

  async getActiveTicket(userId, eventId) {
    return await Ticket.findOne({
      user: userId,
      event: eventId,
      status: {
        $in: ['confirmed', 'pending']
      }
    })
  }

  async getReservedQuantity(eventId) {
    const tickets = await Ticket.find({
      event: eventId,
      status: {
        $in: ['confirmed', 'pending']
      }
    })

    return tickets.reduce(
      (total, ticket) => total + ticket.quantity,
      0
    )
  }

  async getTicketsByUser(userId) {
    return await Ticket.find({
      user: userId
    })
      .populate('event', 'title date location')
      .sort({ createdAt: -1 })
  }

  async getTicketsByEvent(eventId) {
    return await Ticket.find({
      event: eventId
    })
      .populate('user', 'first_name last_name email')
      .sort({ createdAt: -1 })
  }

  async getTicketById(id) {
    return await Ticket.findById(id)
  }

  async updateTicket(id, ticketData) {
    return await Ticket.findByIdAndUpdate(
      id,
      ticketData,
      {
        new: true,
        runValidators: true
      }
    )
  }
}

export default new TicketsDao()