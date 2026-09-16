export const ticketDTO = (ticket) => {
  let user = null
  let event = null

  if (ticket.user) {
    if (ticket.user.email !== undefined) {
      user = {
        id: ticket.user._id.toString(),
        first_name: ticket.user.first_name,
        last_name: ticket.user.last_name,
        email: ticket.user.email
      }
    } else {
      user = ticket.user.toString()
    }
  }

  if (ticket.event) {
    if (ticket.event.title !== undefined) {
      event = {
        id: ticket.event._id.toString(),
        title: ticket.event.title,
        date: ticket.event.date,
        location: ticket.event.location
      }
    } else {
      event = ticket.event.toString()
    }
  }

  return {
    id: (ticket._id || ticket.id).toString(),
    user,
    event,
    quantity: ticket.quantity,
    status: ticket.status,
    reservationCode: ticket.reservationCode,
    createdAt: ticket.createdAt,
    cancelledAt: ticket.cancelledAt
  }
}