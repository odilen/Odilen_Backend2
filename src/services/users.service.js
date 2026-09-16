import usersRepository from '../repositories/users.repository.js'

class UsersService {
  async getAllUsers() {
    return await usersRepository.getAll()
  }
}

export default new UsersService()