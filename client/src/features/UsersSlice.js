import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '../service/index';

const initialState = {
  users: {
    docs: [],
    totalDocs: 0,
    offset: 0,
    limit: 10,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: true,
    prevPage: null,
    nextPage: 2
  },
  totalUsers: 0,
  userCount: 0,
  userAdmin: 0,
  loading: false,
  error: null,
  getuser: null,
  user: null,
  imageUrl: null,
  Users: []
};
//Add User BY Admin
export const AddUsers = createAsyncThunk(
  'user/AddUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await service.addUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get all users by admin
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async ({params}, { rejectWithValue }) => {
    try {
      const response = await service.getUsersByAdmin(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
//get all users by admin without params
export const GetAllUsers = createAsyncThunk(
  'user/GetAllUsers',
  async (req) => {
    try {
      const response = await service.getAllUsers();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);
//get single user by admin
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, thunkAPI) => {
    try {
      const response = await service.getUser(userId);
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Error fetching user');
      } else {
        return thunkAPI.rejectWithValue('Network error');
      }
    }
  }
);
// delete user by Admin
export const deleteUserById = createAsyncThunk(
  'user/deleteUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await service.deleteUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//Update User By Admin
export const updateUserById = createAsyncThunk(
  'user/updateUserById',
  async ({ userId, userData }, thunkAPI) => {
    try {
      const response = await service.updateUser(userId, userData);
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Error updating user');
      } else {
        return thunkAPI.rejectWithValue('Network error');
      }
    }
  }
);
//upload profile pic by user
export const uploadProfilePic = createAsyncThunk(
  'user/uploadProfilePic',
  async (formData, { rejectWithValue }) => {
    try {
      // Call the service to upload the profile picture
      const response = await service.uploadProfilePic(formData);
      return response.data; // Return the data from the response
    } catch (error) {
      // If there's an error, return the error response data
      return rejectWithValue(error.response?.data || { error: 'Failed to upload profile picture' });
    }
  }
);
//get profile picture with user id by user
export const fetchProfilePic = createAsyncThunk(
  'user/fetchProfilePic',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await service.getProfilePic(userId, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);
//update user profile
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }, { rejectWithValue }) => {
      try {
          const response = await service.updateProfile(id, userData);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(AddUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        // state.users = action.payload.docs;
        // state.totalUsers = action.payload.totalUsers;
        // state.userCount = action.payload.userCount;
        // state.userAdmin = action.payload.userAdmin;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfilePic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.profilePic = action.payload;
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfilePic.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfilePic.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.imageUrl = action.payload.imageUrl;
      })
      .addCase(fetchProfilePic.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(GetAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(GetAllUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Users = action.payload;
      })
      .addCase(GetAllUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
    })
    .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
    })
    .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    });
  },
});



export default userSlice.reducer;
