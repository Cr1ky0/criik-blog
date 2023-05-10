import service from '@/utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// util
import { getOneBlogId } from '@/utils';

// interface
import { blogObj, SideMenuItem } from '@/interface';

interface blogMenuInitObj {
  menuList: SideMenuItem[];
  selectedId: string; // 选的博客id
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: blogMenuInitObj = {
  menuList: [] as SideMenuItem[],
  selectedId: '', // 选的博客id
};

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async (id: string) => {
  const response = await service.get(`/api/menus/${id}`);
  const menus = response.data.body.menus;
  // 设置一个初始选中项
  const blogId = getOneBlogId(menus) || '';
  return { menus, blogId };
});

const blogMenuSlice = createSlice({
  name: 'blogMenu',
  initialState,
  reducers: {
    // selectedId
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
    // menuList
    addBlogMenu: (state, action) => {
      const { id, title, belongingMenu } = action.payload;
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
  },
  extraReducers(builder) {
    builder
      .addCase(setMenuList.fulfilled, (state, action) => {
        const { menus, blogId } = action.payload;
        state.menuList = [...menus];
        if (!state.selectedId) state.selectedId = blogId;
      })
      .addCase(setMenuList.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const { addMenu, editMenu, deleteMenu, setSelectedId, addBlogMenu } = blogMenuSlice.actions;
export default blogMenuSlice.reducer;
