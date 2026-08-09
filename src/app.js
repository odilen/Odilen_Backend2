import express from 'express'
import eventsRouter from './routes/events.routes.js'
import sessionsRouter from './routes/sessions.routes.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'Servidor activo'
  })
})

app.use('/api/events', eventsRouter)
app.use('/api/sessions', sessionsRouter)

export default app