import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { userObj } from '@/interface';
import service from '@/utils/request';

interface userInitObj {
  user: userObj;
}

const initialState: userInitObj = {
  user: {} as userObj,
};

export const setMyUser = createAsyncThunk('user/setMyUser', async () => {
  const response = await service.get('/api/users/getMyInfo');
  return Promise.resolve(response.data);
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(setMyUser.fulfilled, (state, action) => {
      const user = action.payload.data.user;
      delete user['_id'];
      state.user = user;
    });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
