import { Router } from 'express'
import {
  getSessionStatus,
  registerUser,
  login,
  current,
  logout
} from '../controllers/sessions.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import passport from 'passport'

const router = Router()

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
router.get('/current', auth, current)
router.post('/logout', logout)


export default router

/*los router deciden el controller a ejcutar */
/*los controller llaman a los services*/
/*a los routes los llama el app.js */
