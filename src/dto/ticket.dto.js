export const ticketDTO = (ticket) => {
  return {
    id: ticket._id || ticket.id,
    quantity: ticket.quantity,
    status: ticket.status,
    reservationCode: ticket.reservationCode,
    createdAt: ticket.createdAt,
    cancelledAt: ticket.cancelledAt,

    user: ticket.user
      ? {
          id: ticket.user._id || ticket.user.id,
          first_name: ticket.user.first_name,
          last_name: ticket.user.last_name,
          email: ticket.user.email
        }
      : null,

    event: ticket.event
      ? {
          id: ticket.event._id || ticket.event.id,
          title: ticket.event.title,
          date: ticket.event.date,
          location: ticket.event.location
        }
      : null
  }
}