import bcrypt from 'bcryptjs'
import UserModel from '../models/Users.model.js';
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

// Register route
async function registerUser(username, email, password) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserModel({ username, email, password: hashedPassword, role: 'user' });
    await newUser.save();

    return newUser;
}
// Login route
async function loginUser(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, userId: user._id, userName: user.username, role: user.role, email: user.email };
}
// Forgot password route
async function ForgotPassword(email) {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('User with given email does not exist');
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
        };

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, response) => {
                if (err) {
                    console.error('Error sending email:', err);
                    reject(err);
                } else {
                    resolve('Recovery email sent');
                }
            });
        });
    } catch (error) {
        console.error('Error in forgot password service:', error);
        throw error;
    }
}
// Reset password route
async function resetPassword(token, password) {
    try {
        if (!token || !password) {
            throw new Error('Invalid request');
        }

        const user = await UserModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            throw new Error('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return 'Password has been reset successfully';
    } catch (error) {
        console.error('Error in reset password service:', error);
        throw error;
    }
}
export default {registerUser,loginUser,ForgotPassword,resetPassword}
