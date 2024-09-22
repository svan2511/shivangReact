import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, logout } from './loginApi';

export const fetchUserLogin = createAsyncThunk(
  'user/login',
  async (data) => {
    const response = await login(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchUserLogout = createAsyncThunk(
  'user/logout',
  async (token) => {
    const response = await logout(token);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const LoginSlice = createSlice({
  name: 'login',
  initialState: {
    value: 0,
    status:'pending',
    loggedIn:false,
    loggedInmsg:null,
    token:null,
    error:null
    
   
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLogin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserLogin.fulfilled, (state, action) => {
        
        state.status = null;
        state.loggedIn = action.payload.success;
        state.loggedInmsg = action.payload.message;
        state.token = action.payload.token;
       
       
      }).addCase(fetchUserLogin.rejected, (state ,action) => { 
        state.status = null;
        state.error = action.error.message;
      })
      .addCase(fetchUserLogout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserLogout.fulfilled, (state, action) => {
        state.status = null;
        state.loggedIn = false;
        state.loggedInmsg = null; 
        state.token = "logout";
        state.error = null;
       
      }).addCase(fetchUserLogout.rejected, (state ,action) => {
        state.status = null;
        state.error = action.error.message;
      })
    }
});

export const { increment, decrement } = LoginSlice.actions;
export default LoginSlice.reducer;
