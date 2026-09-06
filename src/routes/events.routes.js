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
import {
  createTicket
} from '../controllers/tickets.controller.js'

const router = Router()

router.get('/', getEvents)

router.post(
  '/:eid/tickets',
  authenticate,
  createTicket
)

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