import { Router } from 'express'
import { getEvents, createEvent, updateEvent } from '../controllers/events.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { authorizedRoles } from '../middlewares/authorizedRoles.middleware.js'


const router = Router()

router.get('/', getEvents)
router.post(
  '/',
  authenticate,
  authorizedRoles('organizer', 'admin'),
  createEvent
)

router.put(
  '/:id',
  authenticate,
  authorizedRoles('organizer', 'admin'),
  updateEvent
)

export default router