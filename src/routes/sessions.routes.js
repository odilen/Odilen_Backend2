import { Router } from 'express'
import {
  getSessionStatus,
  registerUser
} from '../controllers/sessions.controller.js'

const router = Router()

router.get('/', getSessionStatus)
router.post('/register', registerUser)

export default router