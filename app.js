import express from 'express'
import 'dotenv/config'
import { connectDB } from './src/config/database.js'
// import usersRouter from './src/routes/users.routes.js'
// import sessionsRouter from './src/routes/sessions.routes.js'
// import ticketsRouter from './src/routes/tickets.routes.js'
import eventsRouter from './src/routes/events.routes.js'

const app = express()

app.use(express.json())

// app.use('/api/users', usersRouter)
// app.use('/api/sessions', sessionsRouter)
// app.use('/api/tickets', ticketsRouter)
app.use('/api/events', eventsRouter)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(8080, () => {
      console.log('Servidor escuchando en el puerto 8080')
    })
  } catch (error) {
    console.error('No fue posible iniciar el servidor', error)
    process.exit(1)
  }
}

startServer()
