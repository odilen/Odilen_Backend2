import express from 'express'
import 'dotenv/config'
import { connectDB } from './database.js'
import usersRouter from '../routes/users.routes.js'
import eventsRouter from '../routes/events.routes.js'

const app = express()

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/events', eventsRouter)

export const startServer = async () => {
  try {
    await connectDB()
  } catch (error) {
    console.warn('MongoDB no disponible en este momento, pero el servidor HTTP sigue funcionando')
  }

  const port = process.env.PORT || 8080
  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
  })
}

export default app
