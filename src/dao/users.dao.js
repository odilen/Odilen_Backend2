import User from '../models/user.model.js'

class UsersDao {
  async findByEmail(email) {
    return await User.findOne({ email })
  }

  async createUser(userData) {
    const newUser = new User(userData)
    return await newUser.save()
  }

async getAllUsers() {
  return await User.find().select('-password')
}

}



export default new UsersDao()