import Todo from '../models/Todo.js';
import { createTodoSchema, todoSchema } from '../validation/todo.validation.js';

// Create todo route by user
async function createTodo(todoData, userId) {
    const { error } = createTodoSchema.validate(todoData);
    if (error) {
        throw new Error(`Validation error: ${error.details[0].message}`);
    }
    const { todoName, date, gender, status, description } = todoData;
    
    const todoDate = new Date(date);
    if (isNaN(todoDate.getTime())) {
        throw new Error('Invalid date format');
    }
    
    if (gender !== 'male' && gender !== 'female') {
        throw new Error('Invalid gender');
    }
    
    if (status !== 'pending' && status !== 'completed') {
        throw new Error('Invalid status');
    }
    
    const newTodo = new Todo({
        todoName,
        date: todoDate,
        gender,
        status,
        description,
        user: userId,
    });

    const savedTodo = await newTodo.save();
    return savedTodo;
}
//create todo of user by admin
async function adminCreateTodo(todoData) {
    const { error } = todoSchema.validate(todoData);
    if (error) {
        throw new Error(error.details.map(detail => detail.message).join(', '));
    }
    const { todoName, date, gender, status, description, userId } = todoData;

    if (!todoName || !userId) {
        throw new Error('todoName and userId are required fields.');
    }

    const newTodo = new Todo({
        todoName,
        date,
        gender,
        status,
        description,
        user: userId,
    });

    const savedTodo = await newTodo.save();
    return savedTodo;
}
//Get Single User Todo
async function getTodoById(todoId) {
    try {
        const todo = await Todo.findById(todoId).populate('user');
        return todo;
    } catch (error) {
        throw new Error('Error fetching todo by ID');
    }
}
// Fetch All Users todos By Admin
async function getTodos({ page = 1, limit = 6, search = '', filter = 'all' }) {
    try {
        const query = {
            todoName: { $regex: search, $options: 'i' },
        };

        if (filter !== 'all') {
            query.status = filter;
        }

        const todos = await Todo.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate({
                path: 'user',
                select: 'username email',
            })
            .exec();

        const totalTodos = await Todo.countDocuments(query);

        return {
            todos,
            totalTodos,
            totalPages: Math.ceil(totalTodos / limit),
            currentPage: Number(page),
        };
    } catch (error) {
        throw new Error('Error fetching todos');
    }
}
//Fetch todos route by Authenticated User
async function getAuthenticatedUserTodos({ userId, page = 1, limit = 6, search = '', filter = 'all' }) {
    try {
        const query = {
            user: userId,
            todoName: { $regex: search, $options: 'i' },
        };

        if (filter !== 'all') {
            query.status = filter;
        }

        const todos = await Todo.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalTodos = await Todo.countDocuments(query);

        return {
            todos,
            totalTodos,
            totalPages: Math.ceil(totalTodos / limit),
            currentPage: Number(page),
        };
    } catch (error) {
        throw new Error('Error fetching todos');
    }
}
//Update Todo By User
async function updateTodo({ todoId, userId, todoData }) {
    try {
        const { todoName, date, gender, status, description } = todoData;
        const updatedTodo = await Todo.findOneAndUpdate(
            { _id: todoId, user: userId },
            { todoName, date: new Date(date), gender, status, description },
            { new: true }
        );

        return updatedTodo;
    } catch (error) {
        throw new Error('Error updating todo');
    }
}
//Delete Todo By User
async function deleteTodo({ todoId, userId }) {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: todoId, user: userId });

        return deletedTodo;
    } catch (error) {
        throw new Error('Error deleting todo');
    }
}
// Delete User's Todo by Admin
async function deleteTodoById(todoId) {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(todoId);

        return deletedTodo;
    } catch (error) {
        throw new Error('Error deleting todo by admin');
    }
}
// Update User's Todo by Admin
async function updateTodoByAdmin({ todoId, todoData }) {
    try {
        const { todoName, date, gender, status, description } = todoData;
        const updatedTodo = await Todo.findByIdAndUpdate(
            todoId,
            { todoName, date: new Date(date), gender, status, description },
            { new: true }
        );

        return updatedTodo;
    } catch (error) {
        throw new Error('Error updating todo by admin');
    }
}

export  default{ createTodo , adminCreateTodo,getTodoById,getTodos,getAuthenticatedUserTodos,updateTodo,deleteTodo,deleteTodoById,updateTodoByAdmin };
