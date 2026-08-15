import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import eventsRouter from './routes/events.routes.js'
import sessionsRouter from './routes/sessions.routes.js'
import { initializePassport } from './config/passport.config.js'

const app = express()

initializePassport()

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'Servidor activo'
  })
})

app.use('/api/events', eventsRouter)
app.use('/api/sessions', sessionsRouter)

export default app