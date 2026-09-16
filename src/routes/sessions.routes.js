import { Router } from 'express'
import passport from 'passport'

import {
  getSessionStatus,
  registerUser,
  login,
  current,
  logout
} from '../controllers/sessions.controller.js'

import { authenticate } from '../middlewares/auth.middleware.js'

const router = Router()

const authenticateSession = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      { session: false },
      (error, user) => {
        if (error) {
          return next(error)
        }

        if (!user) {
          const authenticationError = new Error(
            strategy === 'register'
              ? 'Faltan campos obligatorios'
              : 'Credenciales inválidas'
          )

          authenticationError.statusCode =
            strategy === 'register' ? 400 : 401

          return next(authenticationError)
        }

        req.user = user
        return next()
      }
    )(req, res, next)
  }
}

router.get('/', getSessionStatus)

router.post(
  '/register',
  authenticateSession('register'),
  registerUser
)

router.post(
  '/login',
  authenticateSession('login'),
  login
)

router.get('/current', authenticate, current)

router.post('/logout', logout)

export default router