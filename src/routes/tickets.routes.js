import { Router } from 'express'

import {
  getMyTickets
} from '../controllers/tickets.controller.js'
import {
  authenticate
} from '../middlewares/auth.middleware.js'

const router = Router()

router.get(
  '/my-tickets',
  authenticate,
  getMyTickets
)

export default router