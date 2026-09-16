import usersService from '../services/users.service.js'
import { userDTO } from '../dto/user.dto.js'

export const getUsers = async (req, res, next) => {
  try {
    const users = await usersService.getAllUsers()

    return res.status(200).json({
      status: 'success',
      payload: users.map(user => userDTO(user))
    })
  } catch (error) {
    next(error)
  }
}