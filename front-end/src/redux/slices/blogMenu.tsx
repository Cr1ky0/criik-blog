import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface
import { SideMenuItem, blogObj } from '@/interface';
import service from '@/utils/request';

const URL = 'http://localhost:3002/';
const initialState = {
  menuList: [] as SideMenuItem[],
  selectedId: '', // 选的博客id
};

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async () => {
  const response = await service.get(`${URL}api/menus`);
  return response.data;
});

const blogMenuSlice = createSlice({
  name: 'blogMenu',
  initialState,
  reducers: {
    addBlogMenu: (state, action) => {
      const { id, title, belongingMenu, author } = action.payload;
      state.menuList = [
        ...state.menuList.map(menu => {
          if (menu.id === belongingMenu) {
            if (!menu.blogs) menu.blogs = [];
            (menu.blogs as blogObj[]).push({
              id,
              _id: id,
              title,
              belongingMenu,
            });
          }
          if (menu.children)
            menu.children.map(child => {
              if (child.id === belongingMenu) {
                if (!child.blogs) child.blogs = [];
                (child.blogs as blogObj[]).push({
                  id,
                  _id: id,
                  title,
                  belongingMenu,
                  author,
                });
              }
              return child;
            });
          return menu;
        }),
      ];
    },
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
    editMenu: (state, action) => {
      const { id, title, icon } = action.payload;
      state.menuList = [
        ...state.menuList.map(menu => {
          if (menu.id === id) {
            menu.title = title;
            menu.icon = icon;
          } else {
            if (menu.children)
              menu.children = menu.children.map(child => {
                if (child.id === id) {
                  child.title = title;
                  child.icon = icon;
                }
                return child;
              });
          }
          return menu;
        }),
      ];
    },
    deleteMenu: (state, action) => {
      const id = action.payload; // 传入删除menu的id（包括blogId）
      // 删除菜单只有两层，顺便处理第二层的blogs
      let newList = [
        ...state.menuList.filter(menu => {
          if (menu.children) menu.children = [...menu.children.filter(child => child.id !== id)];
          if (menu.blogs) menu.blogs = [...menu.blogs.filter(blog => blog.id !== id)];
          return menu.id !== id;
        }),
      ];
      // 第三层blogs删除
      newList = newList.map(menu => {
        if (menu.children)
          menu.children.map(child => {
            if (child.blogs) child.blogs = [...child.blogs.filter(blog => blog.id !== id)];
          });
        return menu;
      });
      state.menuList = newList;
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
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

export const { addMenu, editMenu, deleteMenu, setSelectedId, addBlogMenu } = blogMenuSlice.actions;
export default blogMenuSlice.reducer;
