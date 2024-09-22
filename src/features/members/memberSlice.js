import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { deleteMember, fetchAllMembers, fetchMemberById, fetchMemberByName, insertMember, updateInstallment } from './memberApi';

export const asyncCreateMember = createAsyncThunk(
  'member/create',
  async (data) => {
    const response = await insertMember(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);


export const deleteAsyncMember = createAsyncThunk(
  'centers/deleteAsyncMember',
  async (id) => {
    const response = await deleteMember(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);


export const fetchAsyncAllMembers = createAsyncThunk(
  'member/getMembers',
  async () => {
    const response = await fetchAllMembers();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchAsyncSingleMember = createAsyncThunk(
  'member/getSingleMember',
  async (id) => {
    const response = await fetchMemberById(id);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const fetchAsyncSingleMemberByName = createAsyncThunk(
  'member/fetchAsyncSingleMemberByName',
  async (name) => {
    const response = await fetchMemberByName(name);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const asyncUpdateInstallment = createAsyncThunk(
  'member/asyncUpdateInstallment',
  async (data) => {
    const response = await updateInstallment(data);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const memberSlice = createSlice({
  name: 'members',
  initialState: {
    imgstatus:null,
    createmember:false,
    creatememberMsg:null,
    members:[],
    singleMember:null,
    updateStatus:false,
    error:null,
    deleteMember:null
   
  },
  reducers: {
    reSetMemberStates: (state) => {
      state.imgstatus=null;
      state.createmember=false;
      state.creatememberMsg=null;
      state.members=[];
      state.singleMember=null;
      state.updateStatus=false;
      state.error = null;
      state.deleteMember = null;
    },
    reSetInstallment: (state) => {
      state.updateStatus=false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncCreateMember.pending, (state) => {
        state.imgstatus = 'loading';
      })
      .addCase(asyncCreateMember.fulfilled, (state, action) => {
        state.imgstatus = null;
        state.createmember = action.payload.success;
        state.creatememberMsg = action.payload.message;
        state.error = null;
      })
      .addCase(asyncCreateMember.rejected, (state, action) => {
        state.imgstatus = null;
        state.error = action.error.message;
      })
      .addCase(fetchAsyncAllMembers.pending, (state) => {
        state.imgstatus = 'loading';
      })
      .addCase(fetchAsyncAllMembers.fulfilled, (state, action) => {
        state.imgstatus = null;
        state.error = null;
        state.members = action.payload.members;
    
    }).addCase(fetchAsyncAllMembers.rejected, (state, action) => {
      state.imgstatus = null;
      state.error = action.error.message;
  
  }).addCase(fetchAsyncSingleMember.pending, (state) => {
      state.imgstatus = 'loading';
    })
    .addCase(fetchAsyncSingleMember.fulfilled, (state, action) => {
      state.imgstatus = null;
      state.error = null;
      state.singleMember = action.payload.member;
  
  }).addCase(fetchAsyncSingleMember.rejected, (state, action) => {
    state.imgstatus = null;
    state.error = action.error.message;

}).addCase(asyncUpdateInstallment.pending, (state) => {
    state.imgstatus = 'loading';
  })
  .addCase(asyncUpdateInstallment.fulfilled, (state, action) => {
    state.imgstatus = null;
    state.error = null;
    state.updateStatus = action.payload.success;

}).addCase(deleteAsyncMember.pending, (state) => {
  //state.status = 'imgloading';
})
.addCase(deleteAsyncMember.fulfilled, (state, action) => {
  state.error = null;
  state.deleteMember = true;
  state.members = state.members.filter(item => item._id !== action.payload.member._id);
}).addCase(fetchAsyncSingleMemberByName.pending, (state) => {
  //state.imgstatus = 'loading';
})
.addCase(fetchAsyncSingleMemberByName.fulfilled, (state, action) => {
  state.imgstatus = null;
  state.error = null;
  state.members = action.payload.members;

}).addCase(fetchAsyncSingleMemberByName.rejected, (state, action) => {
state.imgstatus = null;
state.error = action.error.message;

});
    
  }
});

export const { reSetMemberStates , reSetInstallment } = memberSlice.actions;
export default memberSlice.reducer;
