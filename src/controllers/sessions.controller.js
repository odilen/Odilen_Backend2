import {generateToken} from '../utils/jwt.js'

export const getSessionStatus = (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Ruta de sesiones disponible'
  })
}
export const registerUser = (req, res) => {
  return res.status(201).json({
    status: 'success',
    payload: req.user
  })
}
export const login = (req, res) => {
  try {
    const token = generateToken(req.user)

    res.cookie('currentUser', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
      secure: process.env.NODE_ENV === 'production'
    })

    return res.status(200).json({
      status: 'success',
      message: 'Login correcto'
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    })
  }
}

export const current = (req, res) => {
  return res.status(200).json({
    status: 'success',
    payload: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  })
}

export const logout = (req, res) => {
  res.clearCookie('currentUser', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  })

  return res.status(200).json({
    status: 'success',
    message: 'Sesión cerrada'
  })
}