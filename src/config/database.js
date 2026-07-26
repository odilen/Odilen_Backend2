import mongoose from 'mongoose'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '1.1.1.1'])

export const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL

  if (!mongoUrl) {
    throw new Error('MONGO_URL no está definido. Agrega tu cadena de conexión de Mongo Atlas en el archivo .env')
  }

  try {
    await mongoose.connect(mongoUrl)
    console.log('Base de datos conectada')
  } catch (error) {
    console.error('Error al conectar MongoDB', error)
    throw error
  }
}
