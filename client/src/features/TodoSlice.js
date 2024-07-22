import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '../service/index';

// Create A Todo by user
export const createItem = createAsyncThunk(
  'todos/createItem',
  async (formData, { rejectWithValue }) => {
    const { todoName, date, gender, status, description } = formData;
    if (!todoName || !date || gender === 'select' || status === 'select' || !description) {
      return rejectWithValue('Invalid input');
    }
    try {
      const response = await service.createTodo({
        todoName,
        date,
        gender,
        status,
        description,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//create todo of user by admin
export const createTodoByAdmin = createAsyncThunk(
  'todos/createTodoByAdmin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await service.createTodoByAdmin(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//Get Single Todo By User
export const getTodoById = createAsyncThunk(
  'todos/getTodoById',
  async (todoId, { rejectWithValue }) => {
    try {
      const response = await service.getTodo(todoId);
      return response.data.todo;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Get Todos by user
export const getItems = createAsyncThunk(
  'todos/getItems',
  async ({ page = 1, limit = 6, search = '', filter = 'all' }, { rejectWithValue }) => {
    try {
      const response = await service.getTodos({ page, limit, search, filter });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Get All Todos By Admin
export const getAdminItems = createAsyncThunk(
  'todos/getAdminItems',
  async (param, { rejectWithValue }) => {
    try {
      const response = await service.getAllTodos(param);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Delete Todo by user
export const deleteItem = createAsyncThunk(
  'todos/deleteItem',
  async (todoId, { rejectWithValue }) => {
    try {
      await service.deleteTodo(todoId);
      return todoId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Delete Todos by user
export const deleteItems = createAsyncThunk(
  'todos/deleteItems',
  async (todoIds, { rejectWithValue }) => {
    try {
      await service.deleteTodos(todoIds);
      return todoIds;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Update Todo by user
export const updateItem = createAsyncThunk(
  'todos/updateItem',
  async ({ todoId, updatedTodo }, { rejectWithValue }) => {
    try {
      const response = await service.updateTodo(todoId, updatedTodo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Delete User's Todo by Admin
export const deleteItemByAdmin = createAsyncThunk(
  'todos/deleteItemByAdmin',
  async (todoId, { rejectWithValue }) => {
    try {
      await service.deleteTodoByAdmin(todoId);
      return todoId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
// Update User's Todo by Admin
export const updateItemByAdmin = createAsyncThunk(
  'todos/updateItemByAdmin',
  async ({ todoId, updatedTodo }, { rejectWithValue }) => {
    try {
      const response = await service.updateTodoByAdmin(todoId, updatedTodo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
//get all todos of aithenticated user without params
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (userId, thunkAPI) => {
  try {
    const response = await service.getTodosByUser(userId);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
//get all todos by admin without params
export const fetchTodosByadmin = createAsyncThunk('todos/fetchTodosByadmin', async (_, thunkAPI) => {
  try {
    const response = await service.getTodosByAdmin();
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    totalPages: 0,
    loading: false,
    status: 'idle',
    error: null,
    todo: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTodoByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodoByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTodoByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload.todos;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const updatedTodo = action.payload;
        state.items = state.items.map(todo =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        );
        state.loading = false;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteItems.fulfilled, (state, action) => {
        state.items = state.items.filter(item => !action.payload.includes(item._id));
      })
      .addCase(getAdminItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminItems.fulfilled, (state, action) => {
        state.items = action.payload.todos;
        state.totalPages = action.payload.totalPages;
        state.loading = false;
      })
      .addCase(getAdminItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(deleteItemByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItemByAdmin.fulfilled, (state, action) => {
        state.items = state.items.filter(todo => todo._id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteItemByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTodoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodoById.fulfilled, (state, action) => {
        state.loading = false;
        state.todo = action.payload;
        state.error = null;
      })
      .addCase(getTodoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTodosByadmin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodosByadmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTodosByadmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectTodos = (state) => state.todos.items;
export const selectLoading = (state) => state.todos.loading;
export const selectError = (state) => state.todos.error;

export default todoSlice.reducer;
