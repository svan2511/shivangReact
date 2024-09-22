import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteCenter, fetchAllCenters, fetchCenterById, fetchCenterByName, insertCenter } from './centerApi';

export const fetchAsyncAllCenters = createAsyncThunk(
  'centers/fetchAsyncAllCenters',
  async () => {
    const response = await fetchAllCenters();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const insertAsyncCenter = createAsyncThunk(
  'centers/insertAsyncCenter',
  async (data) => {
    const response = await insertCenter(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const deleteAsyncCenter = createAsyncThunk(
  'centers/deleteAsyncCenter',
  async (id) => {
    const response = await deleteCenter(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const getAsyncCenterById = createAsyncThunk(
  'centers/getAsyncCenterById',
  async (data) => {
    const response = await fetchCenterById(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const getAsyncCenterByName = createAsyncThunk(
  'centers/getAsyncCenterByName',
  async (name) => {
    const response = await fetchCenterByName(name);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const centersSlice = createSlice({
  name: 'centers',
  initialState: {
   centers:[],
   status:null,
   addCenter:false,
   addStatusMsg:null,
   singleCenter:null,
   error:null
   
  },
  reducers: {
    reSetStates: (state) => {
      state.centers = [];
      state.status = null;
      state.addCenter =false;
      state.addStatusMsg =null;
      state.singleCenter =null;
      state.error = null;
    },
    resetSingle: (state) => {
      state.singleCenter =null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncAllCenters.pending, (state) => {
        state.error = "loading";
      })
      .addCase(fetchAsyncAllCenters.fulfilled, (state, action) => {
        state.centers = action.payload.allCenters;
        state.error = null;
      }).addCase(fetchAsyncAllCenters.rejected, (state, action) => {
        state.error = action.error.message;
       
      }).addCase(insertAsyncCenter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(insertAsyncCenter.fulfilled, (state, action) => {
        state.status = null;
        state.addCenter = action.payload.success;
        state.addStatusMsg = action.payload.message;
      }).addCase(insertAsyncCenter.rejected, (state , action) => {
      
        state.status = null;
        state.error = action.error.message;
      }).addCase(getAsyncCenterById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAsyncCenterById.fulfilled, (state, action) => {
        
        state.status = null;
        state.singleCenter = action.payload.center;
      }).addCase(getAsyncCenterById.rejected, (state, action) => {
        state.status = null;
        state.error = action.error.message;
      }).addCase(deleteAsyncCenter.pending, (state) => {
        //state.status = 'imgloading';
      })
      .addCase(deleteAsyncCenter.fulfilled, (state, action) => {
      
        state.centers = state.centers.filter(item => item._id !== action.payload.center._id);
      }).addCase(getAsyncCenterByName.pending, (state) => {
        //state.error = "loading";
      })
      .addCase(getAsyncCenterByName.fulfilled, (state, action) => {
        state.centers = action.payload.allCenters;
        state.error = null;
      }).addCase(getAsyncCenterByName.rejected, (state, action) => {
        state.error = action.error.message;
       
      })


      
      
      
    }
});

export const { reSetStates ,resetSingle } = centersSlice.actions;
export default centersSlice.reducer;
