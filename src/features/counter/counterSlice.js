import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  getDashboardData } from './counterApi';

export const fetchDashBoardAsync = createAsyncThunk(
  'users/fetchDashBoardAsync',
  async (data) => {
    const response = await getDashboardData(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
    status:'pending',
    mapData:[],
    demandData:[],
    centers:[],
    members:[]
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
      .addCase(fetchDashBoardAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashBoardAsync.fulfilled, (state, action) => {
        state.mapData = action.payload.map;
        state.demandData = action.payload.demandData;
        
        state.centers = action.payload.centers;
        state.members = action.payload.members;
       // state.users = action.payload.users;
       
      })
    }
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
