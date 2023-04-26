import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface
import { SideMenuItem } from '@/interface';
import service from '@/utils/request';
import { getSideMenuItem } from '@/utils';

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
  // TODO:解决所有state状态更改（并重构结构将其放在成功回调内部）
  reducers: {
    // 将新对象插入Menu（Grade<=2）
    addMenu: (state, action) => {
      const newMenu = action.payload;
      if (newMenu.grade === 1) {
        state.menuList = [...state.menuList, newMenu];
      } else {
        state.menuList = [
          ...state.menuList.map(menu => {
            if (menu.id === newMenu.belongingMenu) {
              if (!menu.children) menu.children = [];
              menu.children.push(newMenu);
            }
            return menu;
          }),
        ];
      }
    },
  },
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

export const { addMenu } = blogMenuSlice.actions;
export default blogMenuSlice.reducer;
