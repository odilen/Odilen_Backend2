import express from 'express'
import { Register } from '../controllers/users.controller.js'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Ruta de usuarios funcionando' })
})

router.post('/register', Register)

export default router
