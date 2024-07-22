import axiosInstance from './axios';
import apiRoutes from '../constants';

const service = {
  //Todos
  createTodo: async (data, config) => await axiosInstance.post(apiRoutes.todos, data, config),
  createTodoByAdmin: async (data, config) => await axiosInstance.post(apiRoutes.todos + '/admincreatetodo', data, config),
  getTodos: async (params) => await axiosInstance.get(`${apiRoutes.todos}/auth/todos`, { params }),
  getTodosByUser: async () => await axiosInstance.get(`${apiRoutes.todos}/auth/getalltodos`),
  getTodosByAdmin: async () => await axiosInstance.get(`${apiRoutes.todos}/auth/getalltodosbyadmin`),
  getTodosCount: async () => await axiosInstance.get(`${apiRoutes.todos}/count`),
  getAllTodos: async (params) => await axiosInstance.get(apiRoutes.todos, { params }),
  getAllTodosByAdmin: async () => await axiosInstance.get(apiRoutes.todos),
  getTodo: async (todoId) => await axiosInstance.get(apiRoutes.todos + "/" + todoId),
  deleteTodo: async (id) => await axiosInstance.delete(apiRoutes.todos + "/" + id),
  updateTodo: async (id, data) => await axiosInstance.put(apiRoutes.todos + "/" + id, data),
  deleteTodos: async (ids) => await axiosInstance.delete(apiRoutes.todos + "/list"),
  deleteTodoByAdmin: async (id) => await axiosInstance.delete(apiRoutes.todos + "/admin/" + id),
  updateTodoByAdmin: async (id, data) => await axiosInstance.put(apiRoutes.todos + "/admin/" + id, data),

  //Authentication
  register: async (userData) => await axiosInstance.post(apiRoutes.auth + '/register', userData),
  login: async (credentials) => await axiosInstance.post(apiRoutes.auth + '/login', credentials),
  forgotPassword: async (email) => await axiosInstance.post(apiRoutes.auth + '/forgot-password', email),
  getAuthenticatedUser: async () => await axiosInstance.get(apiRoutes.auth + '/authenticate'),

  //users
  addUser: async (userData) => await axiosInstance.post(apiRoutes.user, userData),
  getUsersByAdmin: async (params) => await axiosInstance.get(apiRoutes.user, { params }),
  getAllUsers: async () => await axiosInstance.get(apiRoutes.user + '/getallusers'),
  deleteUser: async (id) => await axiosInstance.delete(apiRoutes.user + "/" + id),
  getUser: async (id) => await axiosInstance.get(`${apiRoutes.user}/${id}`),
  updateUser: async (id, userData) => await axiosInstance.put(`${apiRoutes.user}/${id}`, userData),

  //Profile Pictures
  uploadProfilePic: async (formData) => await axiosInstance.post(`${apiRoutes.user}/UploadProfilePhoto`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getProfilePic: async (id) => await axiosInstance.get(`${apiRoutes.user}/GetProfilePic/${id}`),
  updateProfile: async (id, userData) => await axiosInstance.put(apiRoutes.user + "/profileupdate/" + id, userData),

};

export default service;
