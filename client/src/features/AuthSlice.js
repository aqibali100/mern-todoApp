import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import service from '../service';

// Initial state
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,
  profilePic: null,
  status: null,
};
// authenticate User
export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async () => {
    try {
      const response = await service.getAuthenticatedUser();
      return response
    } catch (error) {
      throw error;
    }
  }
);
// Login User
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await service.login({ email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Register User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await service.register(userData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Forget Password
export const forgetPassword = createAsyncThunk(
  'auth/forgetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await service.forgotPassword({ email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:5000/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.profilePic = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.setItem('notificationShown', 'true');
    },
    clearStatus: (state) => {
      state.status = null;
    },
    setProfilePic: (state, action) => {
      state.profilePic = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem('user', JSON.stringify(action.payload));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      })
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
    .addCase(forgetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.status = { success: 'Recovery email sent. Please check your inbox.' };
    })
    .addCase(forgetPassword.rejected, (state, action) => {
      state.loading = false;
      state.status = { error: action.payload || 'Failed to send password reset email. Please try again.' };
    })
    .addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = null;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.status = { success: 'Password has been reset successfully. You can now log in with your new password.' };
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.status = { error: action.payload.message || 'Failed to reset password. Please try again.' };
    })
    
},
});

export const { logout, setProfilePic, clearStatus } = authSlice.actions;

export default authSlice.reducer;
