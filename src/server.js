import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/database.js'

const startServer = async () => {
  try {
    await connectDB()
  } catch (error) {
    console.warn(
      'MongoDB no disponible en este momento, pero el servidor HTTP sigue funcionando'
    )
  }

  const port = process.env.PORT || 8080

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`)
  })
}

startServer()