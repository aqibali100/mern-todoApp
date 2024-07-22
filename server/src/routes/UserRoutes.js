import express from 'express';
import authMiddleware from '../middlewares/AuthMiddleWares.js';
import UserModel from '../models/Users.model.js';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import { getUsersByAdmin, registeredUser } from '../controllers/user.controller.js';
import validate from '../middlewares/validate.js';
import { getUsers } from '../validation/user.validation.js';
import UserController from '../controllers/user.controller.js';
import Todo from '../models/Todo.js';

const UserRouter = express.Router();

//Create user by Admin
UserRouter.post('/user', authMiddleware, registeredUser);
//Get All User List by admin
UserRouter.get('/user', validate(getUsers), getUsersByAdmin ,authMiddleware);
//Get All User List by admin without pagination
UserRouter.get('/user/getallusers',authMiddleware, async (req, res) => {
    try {
        const users = await UserModel.find();
        const usersWithTodoCount = await Promise.all(users.map(async (user) => {
            const todoCount = await Todo.countDocuments({ user: user._id });
            return { ...user.toObject(), todoCount };
        }));
        res.json(usersWithTodoCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
//delete user info by admin
UserRouter.delete('/user/:id',authMiddleware, UserController.deleteUser); ``
// get user info by user id in admin page
UserRouter.get('/user/:id',authMiddleware, UserController.getUser);
//Update User info By Admin
UserRouter.put('/user/:id',authMiddleware, UserController.updateUser);
//update User Profile
UserRouter.put('/user/profileupdate/:id', authMiddleware, async (req, res) => {
    const { userName, email } = req.body;
    const userId = req.params.id;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (userName) user.username = userName;
        if (email) user.email = email;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
// Profile upload by user
UserRouter.post('/user/UploadProfilePhoto', authMiddleware, upload.single('file'), async (req, res) => {
    if (req.file) {
        const userId = req.user._id;

        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            user.profilePic = req.file.filename;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: 'Failed to save profile picture' });
        }
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});
// Get user profile pic by user id
UserRouter.get('/GetProfilePic', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId);

        if (!user || !user.profilePic) {
            return res.status(404).json({ error: 'Profile picture not found' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${user.profilePic}`;
        res.json({ imageUrl });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve profile picture' });
    }
});
// Get user pic by admin
UserRouter.get('/user/GetProfilePic/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from route parameter

        // Find the user by ID
        const user = await UserModel.findById(userId);

        // Check if user exists and has a profile picture
        if (!user || !user.profilePic) {
            return res.status(404).json({ error: 'Profile picture not found' });
        }

        // Construct the URL for the profile picture
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${user.profilePic}`;
        res.json({ imageUrl });
    } catch (err) {
        // Handle any errors that occur during the process
        res.status(500).json({ error: 'Failed to retrieve profile picture' });
    }
});
// Get all users' profiles (including userId, userName, and imageUrl)
UserRouter.get('/GetAllProfiles', async (req, res) => {
    try {
        const users = await UserModel.find({}).select('username profilePic').populate('profilePic');
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No profiles found' });
        }
        const defaultImageUrl = `${req.protocol}://${req.get('host')}/uploads/no-user.webp`;
        const profilesData = users.map(user => ({
            userId: user._id,
            userName: user.username,
            imageUrl: user.profilePic ? `${req.protocol}://${req.get('host')}/uploads/${user.profilePic}` : defaultImageUrl
        }));

        res.json(profilesData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve profiles' });
    }
});
// Serve uploaded profile pictures
UserRouter.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

//Create User By Admin



export default UserRouter;
