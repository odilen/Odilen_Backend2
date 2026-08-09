import sessionsService from '../services/sessions.service.js'
import {generateToken} from '../utils/jwt.js'
import { isValidPassword } from '../utils/hash.js'
import UserModel from '../models/user.model.js'

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

export const login = async (req, res) => {

  try {
    const {email, password} = req.body

    if (!email || !password) {
      const error = new Error('Faltan campos obligatorios')
      error.statusCode = 400
      throw error
    }

    const normalizedEmail = email.trim().toLowerCase()
    const user = await UserModel.findOne({
      email: normalizedEmail
    })
    if (!user) {
      const error = new Error('Credenciales inválidas')
      error.statusCode = 401
      throw error
    }
        const validPassword = await isValidPassword(password, user.password) //comparo pswd ingresada n texto plano con la guardada en la base de datos hasheada

    if (!validPassword) {
      const error = new Error('Credenciales inválidas')
      error.statusCode = 401
      throw error
    }

    const tokenUser = {
      id: user._id,
      email: user.email,
      role: user.role
    }
    const token = generateToken(tokenUser)
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
    return res.status(error.statusCode || 500).json({
      status: 'error', 
      message: error.message || 'Error interno del servidor'
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