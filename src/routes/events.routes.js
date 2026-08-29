import { Router } from 'express'
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus
} from '../controllers/events.controller.js'
import {
  authenticate
} from '../middlewares/auth.middleware.js'
import {
  authorizedRoles
} from '../middlewares/authorizedRoles.middleware.js'

const router = Router()

router.get('/', getEvents)

router.get('/:id', getEventById)

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

router.patch(
  '/:id/status',
  authenticate,
  authorizedRoles('organizer', 'admin'),
  updateEventStatus
)

export default router