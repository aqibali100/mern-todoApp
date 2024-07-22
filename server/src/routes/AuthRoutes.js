import express from 'express';
import dotenv from 'dotenv';
import authMiddleware from '../middlewares/AuthMiddleWares.js';
import authController from '../controllers/auth.controller.js';
dotenv.config();
const router = express.Router();

// Register route
router.post('/auth/register', authController.register, authMiddleware);
// Login route
router.post('/auth/login', authController.login, authMiddleware);
// Authenticate route
router.get('/auth/authenticate', authMiddleware, authController.authenticate);
// Forgot password route
router.post('/auth/forgot-password', authController.forgotPassword);
// Reset password route
router.post('/auth/reset-password/:token', authController.resetPassword);

export default router;
