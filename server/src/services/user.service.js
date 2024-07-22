import UserModel from '../models/Users.model.js';
import Todo from '../models/Todo.js'
import bcrypt from 'bcryptjs'
import { userRegistrationSchema } from '../validation/user.validation.js';
//create user by admin
export const registerUser = async (userData) => {
  const { error } = userRegistrationSchema.validate(userData);

  if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`);
  }
    const { username, email, password, role } = userData;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({ username, email, password: hashedPassword, role });
    await newUser.save();

    return newUser;
};
//get Users by admin
export const getUsers = async (filters, options) => {
  const { search, role } = filters;
  const { limit, page } = options;
  const query = {};

  if (search && search.trim() !== '') {
    query.username = new RegExp(search.trim(), 'i')
  }
  if (role && role !== 'all') {
    query.role = role;
  }
  try {
    const users = await UserModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password')
      .exec();
    const total = await UserModel.countDocuments(query).exec();
    const userIds = users.map(user => user._id);
    const todosCount = await Todo.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: '$user', count: { $sum: 1 } } }
    ]);
    
    const baseUrl = process.env.APP_URL || 'http://localhost:5000'; 
    const defaultProfilePic = `${baseUrl}/uploads/no-user.webp`;

    const usersWithDetails = users.map(user => {
      const profilePicUrl = user.profilePic
        ? `${baseUrl}/uploads/${user.profilePic}`
        : defaultProfilePic;

      const userTodosCount = todosCount.find(todo => todo._id.toString() === user._id.toString());
      return {
        ...user.toObject(),
        todosCount: userTodosCount ? userTodosCount.count : 0,
        profilePicUrl
      };
    });
    return {
      docs: usersWithDetails,
      totalPages: Math.ceil(total / limit),
      totalDocs: total,
      currentPage: page,
    };
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};
//delete user info by admin
async function deleteUser(userId) {
    try {
        await UserModel.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error(`Error deleting user: ${error.message}`);
    }
}
// get user info by user id in admin page
async function getUserById(userId) {
    try {
        const user = await UserModel.findById(userId);
        return user;
    } catch (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }
}
//Update User info By Admin
async function updateUser(userId, updatedUserData) {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
        return updatedUser;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

export default { deleteUser, getUserById, updateUser }


