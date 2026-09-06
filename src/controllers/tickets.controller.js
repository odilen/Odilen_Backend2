import ticketsService from '../services/tickets.service.js'

const sendErrorResponse = (
  res,
  error,
  defaultMessage
) => {
  console.error(defaultMessage, error)

  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'El ID no es válido'
    })
  }

  return res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || defaultMessage
  })
}

export const createTicket = async (req, res) => {
  try {
    const newTicket = await ticketsService.createTicket(
      req.params.eid,
      req.user,
      req.body.quantity
    )

    return res.status(201).json({
      status: 'success',
      message: 'Inscripción realizada correctamente',
      data: newTicket
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al realizar la inscripción'
    )
  }
}
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await ticketsService.getMyTickets(
      req.user.id
    )

    return res.status(200).json({
      status: 'success',
      data: tickets
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al obtener tus tickets'
    )
  }
}

export const getEventTickets = async (req, res) => {
  try {
    const tickets =
      await ticketsService.getEventTickets(
        req.params.eid,
        req.user
      )

    return res.status(200).json({
      status: 'success',
      data: tickets
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al obtener los tickets del evento'
    )
  }
}
export const cancelTicket = async (req, res) => {
  try {
    const cancelledTicket =
      await ticketsService.cancelTicket(
        req.params.tid,
        req.user
      )

    return res.status(200).json({
      status: 'success',
      message: 'Inscripción cancelada correctamente',
      data: cancelledTicket
    })
  } catch (error) {
    return sendErrorResponse(
      res,
      error,
      'Error al cancelar la inscripción'
    )
  }
}