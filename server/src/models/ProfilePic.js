import mongoose from 'mongoose';

const ProfilePicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ProfilePic = mongoose.model('ProfilePic', ProfilePicSchema);
export default ProfilePic;
