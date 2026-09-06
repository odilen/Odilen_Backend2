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
      req.user.id,
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