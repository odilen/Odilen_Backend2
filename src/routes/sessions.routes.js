import { Router } from 'express'
import {
  getSessionStatus,
  registerUser,
  login,
  current,
  logout
} from '../controllers/sessions.controller.js'
import passport from 'passport'

const router = Router()

const authenticateCurrent = (req, res, next) => {
  passport.authenticate(
    'current',
    { session: false },
    (error, user) => {
      if (error || !user) {
        return res.status(401).json({
          status: 'error',
          message: 'No autenticado'
        })
      }

      req.user = user
      next()
    }
  )(req, res, next)
}

router.get('/', getSessionStatus)
router.post(
  '/register',
  passport.authenticate('register', { session: false }),
  registerUser
)
router.post(
  '/login',
  passport.authenticate('login', { session: false }),
  login
)
router.get('/current', authenticateCurrent, current)
router.post('/logout', logout)


export default router

/*los router deciden el controller a ejcutar */
/*los controller llaman a los services*/
/*a los routes los llama el app.js */
