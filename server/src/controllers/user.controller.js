import { registerUser, getUsers } from '../services/user.service.js';
import userService from '../services/user.service.js';
import pick from '../utils/pick.js';
//create user by admin
export const registeredUser = async (req, res) => {
    try {
        const newUser = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        if (error.message === 'Email is already registered') {
            return res.status(400).json({ message: error.message });
        } else if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: `Validation error: ${errors.join(', ')}` });
        } else {
            res.status(500).json({ message: 'Server error occurred during registration', error: error.message });
        }
    }
};
//get users by admin
export const getUsersByAdmin = async (req, res) => {
    let filters = pick(req.query, ['search', 'role']);
    let options = pick(req.query, ['limit', 'page']);
    try {
        const result = await getUsers(filters, options);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
//delete user info by admin
async function deleteUser(req, res) {
    const userId = req.params.id;
    try {
        await userService.deleteUser(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// get user info by user id in admin page
async function getUser(req, res) {
    const userId = req.params.id;
    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
//Update User info By Admin
async function updateUser(req, res) {
    const userId = req.params.id;
    const updatedUserData = req.body;
    try {
        const updatedUser = await userService.updateUser(userId, updatedUserData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export default { deleteUser, getUser, updateUser }