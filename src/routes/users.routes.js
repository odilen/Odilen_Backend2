import express from 'express'
import { getUsers } from '../controllers/users.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { authorizedRoles } from '../middlewares/authorizedRoles.middleware.js'

const router = express.Router()

router.get(
  '/',
  authenticate,
  authorizedRoles('admin'),
  getUsers
)

export default router
