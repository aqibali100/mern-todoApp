import express from 'express';
import authMiddleware from '../middlewares/AuthMiddleWares.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import todoController from '../controllers/todo.controller.js'
import Todo from '../models/Todo.js';

const TodoRoutes = express.Router();
// Create todo route by user
TodoRoutes.post('/todos', authMiddleware, todoController.createTodoController);
//create todo of user by admin
TodoRoutes.post('/todos/admincreatetodo',authMiddleware, todoController.adminCreateTodoController);
//Get Single User Todo
TodoRoutes.get('/todos/:id', authMiddleware, todoController.getTodoByIdController);
// Fetch All Users todos By Admin
TodoRoutes.get('/todos', authMiddleware, todoController.getTodosController);
//Fetch todos route by Authenticated User
TodoRoutes.get('/todos/auth/todos', authMiddleware, todoController.getAuthenticatedUserTodosController);
//Update Todo By User
TodoRoutes.put('/todos/:id', authMiddleware, todoController.updateTodoController);
//Delete Todo By User
TodoRoutes.delete('/todos/:id', authMiddleware, todoController.deleteTodoController);
// Delete User's Todo by Admin
TodoRoutes.delete('/todos/admin/:id', authMiddleware, adminMiddleware, todoController.deleteTodoByAdminController);
// Update User's Todo by Admin
TodoRoutes.put('/todos/admin/:id', authMiddleware, adminMiddleware, todoController.updateTodoByAdminController);
//get all todos by user without params
TodoRoutes.get('/todos/auth/getalltodos', authMiddleware, async (req, res) => {
  try {
    const user = req.user._id;
    const todos = await Todo.find({ user });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching todos' });
  }
});
//get all todos count by admin
TodoRoutes.get('/todos/auth/getalltodosbyadmin', authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching todos' });
  }
}); 
export default TodoRoutes;
