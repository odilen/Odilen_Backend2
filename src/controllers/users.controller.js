import sessionsService from '../services/sessions.service.js'

export const Register = async (req, res) => {
  try {
    const result = await sessionsService.register(req.body)
    return res.status(201).json({ message: 'Usuario registrado exitosamente', data: result })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    return res.status(500).json({ message: 'Error al registrar usuario', error: error.message })
  }
}