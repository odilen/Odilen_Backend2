import { Router } from 'express'
import {
  getSessionStatus,
  registerUser,
  login
} from '../controllers/sessions.controller.js'

const router = Router()

router.get('/', getSessionStatus)
router.post('/register', registerUser)
router.post('/login', login)


export default router

/*los router deciden el controller a ejcutar */
/*los controller llaman a los services*/
/*a los routes los llama el app.js */
