export const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'El ID o el valor enviado no es válido'
    })
  }

  if (error.code === 11000) {
    return res.status(409).json({
      status: 'error',
      message: 'Ya existe un registro con esos datos únicos'
    })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: error.message
    })
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'error',
      message: 'El JSON enviado no es válido'
    })
  }

  const statusCode = error.statusCode || 500

  return res.status(statusCode).json({
    status: 'error',
    message:
      statusCode >= 500
        ? 'Error interno del servidor'
        : error.message
  })
}