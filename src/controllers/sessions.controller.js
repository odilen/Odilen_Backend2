import sessionsService from '../services/sessions.service.js'

export const getSessionStatus = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Ruta de sesiones disponible'
  })
}

export const registerUser = async (req, res) => {
  try {
    const user = await sessionsService.registerUser(req.body)

    return res.status(201).json({
      status: 'success',
      payload: user
    })
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Error interno del servidor'
    })
  }
}