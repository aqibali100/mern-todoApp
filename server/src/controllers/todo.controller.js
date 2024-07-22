import todoService from '../services/todo.services.js';


// Create todo route by user
async function createTodoController(req, res) {
    const { todoName, date, gender, status, description } = req.body;
    const userId = req.user._id;

    try {
        const savedTodo = await todoService.createTodo({ todoName, date, gender, status, description }, userId);
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(400).json({ message: error.message });
    }
}
//create todo of user by admin
async function adminCreateTodoController(req, res) {
    const { todoName, date, gender, status, description, userId } = req.body;

    try {
        const savedTodo = await todoService.adminCreateTodo({ todoName, date, gender, status, description, userId });
        res.status(201).json(savedTodo);
    } catch (error) {
        console.error('Error creating admin todo:', error);
        res.status(500).json({ message: error.message });
    }
}
//Get Single User Todo
async function getTodoByIdController(req, res) {
    const { id } = req.params;

    try {
        const todo = await todoService.getTodoById(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ todo });
    } catch (error) {
        console.error('Error fetching todo by ID:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}
// Fetch All Users todos By Admin
async function getTodosController(req, res) {
    const { page, limit, search, filter } = req.query;

    try {
        const result = await todoService.getTodos({ page, limit, search, filter });
        res.json(result);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
//Fetch todos route by Authenticated User
async function getAuthenticatedUserTodosController(req, res) {
    const { page, limit, search, filter } = req.query;
    const userId = req.user._id;

    try {
        const result = await todoService.getAuthenticatedUserTodos({ userId, page, limit, search, filter });
        res.json(result);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
//Update Todo By User
async function updateTodoController(req, res) {
    const { todoName, date, gender, status, description } = req.body;
    const todoId = req.params.id;
    const userId = req.user._id;

    try {
        const updatedTodo = await todoService.updateTodo({
            todoId,
            userId,
            todoData: { todoName, date, gender, status, description },
        });

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found or user unauthorized' });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
//Delete Todo By User
async function deleteTodoController(req, res) {
    const todoId = req.params.id;
    const userId = req.user._id;

    try {
        const deletedTodo = await todoService.deleteTodo({ todoId, userId });

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found or user unauthorized' });
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
// Delete User's Todo by Admin
async function deleteTodoByAdminController(req, res) {
    const todoId = req.params.id;

    try {
        const deletedTodo = await todoService.deleteTodoById(todoId);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully by admin' });
    } catch (error) {
        console.error('Error deleting todo by admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
// Update User's Todo by Admin
async function updateTodoByAdminController(req, res) {
    const { todoName, date, gender, status, description } = req.body;
    const todoId = req.params.id;

    try {
        const updatedTodo = await todoService.updateTodoByAdmin({
            todoId,
            todoData: { todoName, date, gender, status, description },
        });

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(updatedTodo);
    } catch (error) {
        console.error('Error updating todo by admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export default { createTodoController, adminCreateTodoController, getTodoByIdController, getTodosController, getAuthenticatedUserTodosController,updateTodoController,deleteTodoController,deleteTodoByAdminController,updateTodoByAdminController };
