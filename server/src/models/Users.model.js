import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  screenLockPassword: { type: String },
  resetPasswordToken: { type: String }, 
  resetPasswordExpires: { type: Date }, 
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profilePic: { type: String }
});

userSchema.plugin(mongoosePaginate);
userSchema.index({ name: 'text', email: 'text' });
const UserModel = mongoose.model('User', userSchema);

export default UserModel;
