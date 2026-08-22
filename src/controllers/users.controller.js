import usersRepository from '../repositories/users.repository.js'

export const getUsers = async (req, res) => {
  try {
    const users = await usersRepository.getAll()

    return res.status(200).json({
      status: 'success',
      payload: users
    })

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuarios'
    })
  }
}