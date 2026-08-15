import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

import usersRepository from '../repositories/users.repository.js'
import { createHash, isValidPassword } from '../utils/hash.js'

export const initializePassport = () => {
  passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, email, password, done) => {
        try {
          const { first_name, last_name } = req.body

          if (!first_name || !last_name || !email || !password) {
            const error = new Error('Faltan campos obligatorios')
            error.statusCode = 400
            return done(error)
          }

          const normalizedEmail = email.trim().toLowerCase()
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

          if (!emailRegex.test(normalizedEmail)) {
            const error = new Error('El formato del email no es válido')
            error.statusCode = 400
            return done(error)
          }

          if (password.length < 8) {
            const error = new Error(
              'La contraseña debe tener al menos 8 caracteres'
            )
            error.statusCode = 400
            return done(error)
          }

          const existingUser =
            await usersRepository.getByEmail(normalizedEmail)

          if (existingUser) {
            const error = new Error('El email ya está registrado')
            error.statusCode = 409
            return done(error)
          }

          const hashedPassword = await createHash(password)

          const newUser = await usersRepository.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user'
          })

          const userResponse = {
            id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            role: newUser.role
          }

          return done(null, userResponse)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
    passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const normalizedEmail = email.trim().toLowerCase()

          const user =
            await usersRepository.getByEmail(normalizedEmail)

          if (!user) {
            const error = new Error('Credenciales inválidas')
            error.statusCode = 401
            return done(error)
          }

          const validPassword = await isValidPassword(
            password,
            user.password
          )

          if (!validPassword) {
            const error = new Error('Credenciales inválidas')
            error.statusCode = 401
            return done(error)
          }

          const authenticatedUser = {
            id: user._id,
            email: user.email,
            role: user.role
          }

          return done(null, authenticatedUser)
        } catch (error) {
          return done(error)
        }
      }
    )
  )
}

export default passport