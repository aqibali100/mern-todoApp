import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const todoSchema = new mongoose.Schema({
    todoName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'other'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
todoSchema.plugin(mongoosePaginate);

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
