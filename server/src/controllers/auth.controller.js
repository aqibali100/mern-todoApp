import userService from '../services/auth.services.js'
import { registerSchema } from '../validation/user.validation.js';

// Register route
async function register(req, res) {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: `Validation error: ${error.details.map(detail => detail.message).join(', ')}` });
    }
    const { username, email, password } = req.body;
    try {
        const user = await userService.registerUser(username, email, password);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        if (error.message === 'Email is already registered') {
            return res.status(400).json({ message: error.message });
        } else if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: `Validation error: ${errors.join(', ')}` });
        } else {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Server error occurred during registration', error: error.message });
        }
    }
}
// Login route
async function login(req, res) {
    const { email, password } = req.body;

    try {
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const userData = await userService.loginUser(email, password);
        res.json(userData);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(400).json({ message: error.message });
    }
}
// Authenticate route
async function authenticate(req, res) {
    try {
        const user = await UserModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
// Forgot password route
async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        if (typeof email !== 'string') {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const message = await userService.ForgotPassword(email);
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ message: 'Given Email Does not Exist!' });
    }
}
// Reset password route
async function resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const message = await authService.resetPassword(token, password);
        res.json({ message });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export default { register, login, authenticate, forgotPassword, resetPassword }

