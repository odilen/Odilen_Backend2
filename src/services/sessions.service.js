import usersRepository from '../repositories/users.repository.js'
import { createHash } from '../utils/hash.js'

class SessionsService {
  async registerUser(userData) {
    const { first_name, last_name, email, password } = userData

    if (!first_name || !last_name || !email || !password) {
      const error = new Error('Faltan campos obligatorios')
      error.statusCode = 400
      throw error
    }

    const normalizedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(normalizedEmail)) {
      const error = new Error('El formato del email no es válido')
      error.statusCode = 400
      throw error
    }

    if (password.length < 8) {
      const error = new Error(
        'La contraseña debe tener al menos 8 caracteres'
      )
      error.statusCode = 400
      throw error
    }

    const existingUser = await usersRepository.getByEmail(normalizedEmail)

    if (existingUser) {
      const error = new Error('El email ya está registrado')
      error.statusCode = 409
      throw error
    }

    const hashedPassword = await createHash(password)

    const newUser = await usersRepository.create({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user'
    })

    return {
      id: newUser._id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role
    }
  }
}

export default new SessionsService()