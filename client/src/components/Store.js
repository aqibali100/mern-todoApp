import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/AuthSlice';
import todoReducer from '../features/TodoSlice'
import userReducer from '../features/UsersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    user: userReducer,
  },
});
