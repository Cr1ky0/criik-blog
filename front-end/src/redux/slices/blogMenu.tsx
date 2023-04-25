import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface
import { SideMenuItem } from '@/interface';
import service from '@/utils/request';

const URL = 'http://localhost:3002/';
const initialState = {
  menuList: [] as SideMenuItem[],
};

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async () => {
  const response = await service.get(`${URL}api/menus`);
  return response.data;
});

const blogMenuSlice = createSlice({
  name: 'blogMenu',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setMenuList.fulfilled, (state, action) => {
        const menus = action.payload.body.menus;
        state.menuList = [...menus];
      })
      .addCase(setMenuList.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default blogMenuSlice.reducer;
