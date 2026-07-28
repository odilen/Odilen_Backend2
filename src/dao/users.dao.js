import User from '../models/user.model.js';

class UsersDao {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

async createUser(userData) {

    const newUser = new User(userData);
    return await newUser.save();
    
  } 
}
export default new UsersDao();