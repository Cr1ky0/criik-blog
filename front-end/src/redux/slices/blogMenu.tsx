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

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async () => {
  const response = await service.get(`/api/menus/getSelfMenu`);
  const menus = response.data.body.menus;
  // 设置一个初始选中项
  let blogId = getOneBlogId(menus) || '';
  if (menus[0].blogs[0]) blogId = menus[0].blogs[0].id;
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
              } else if (child.children) {
                child.children.map(grandChild => {
                  if (grandChild.id === belongingMenu) {
                    if (!grandChild.blogs) grandChild.blogs = [];
                    (grandChild.blogs as blogObj[]).push({
                      id,
                      _id: id,
                      title,
                      belongingMenu,
                    });
                  }
                });
              }
              return child;
            });
          return menu;
        }),
      ];
    },
    // 将新对象插入Menu
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
            } else if (menu.children) {
              menu.children = menu.children.map(child => {
                if (child.id === newMenu.belongingMenu) {
                  if (!child.children) child.children = [];
                  child.children.push(newMenu);
                }
                return child;
              });
            }
            return menu;
          }),
        ];
      }
    },
    editMenu: (state, action) => {
      const { id, title, icon, color } = action.payload;
      state.menuList = [
        ...state.menuList.map(menu => {
          if (menu.id === id) {
            menu.title = title;
            menu.icon = icon;
            menu.color = color;
          } else if (menu.children) {
            menu.children = menu.children.map(child => {
              if (child.id === id) {
                child.title = title;
                child.icon = icon;
                child.color = color;
              } else if (child.children) {
                child.children = child.children.map(grandChild => {
                  if (grandChild.id === id) {
                    grandChild.title = title;
                    grandChild.icon = icon;
                    grandChild.color = color;
                  }
                  return grandChild;
                });
              }
              return child;
            });
          }
          return menu;
        }),
      ];
    },
    deleteMenu: (state, action) => {
      const id = action.payload; // 传入删除menu的id（包括对blog删除的处理）
      // 删除菜单和blogs都有三层
      state.menuList = [
        // floor1
        ...state.menuList.filter(menu => {
          // floor2
          if (menu.children) {
            menu.children = menu.children.filter(child => {
              if (child.blogs) child.blogs = child.blogs.filter(blog => blog.id !== id);
              // floor3
              if (child.children) {
                child.children = child.children.filter(grandChild => {
                  if (grandChild.blogs) grandChild.blogs = grandChild.blogs.filter(blog => blog.id !== id);
                  return grandChild.id !== id;
                });
              }
              return child.id !== id;
            });
          }
          if (menu.blogs) menu.blogs = menu.blogs.filter(blog => blog.id !== id);
          return menu.id !== id;
        }),
      ];
    },
    editBlogMenu: (state, action) => {
      const { id, title, belongingMenu } = action.payload;
      state.menuList = [
        ...state.menuList.map(menu => {
          if (menu.blogs)
            menu.blogs.map(blog => {
              if (blog.id === id) {
                blog.title = title;
                blog.belongingMenu = belongingMenu;
              }
            });
          if (menu.children)
            menu.children.map(child => {
              if (child.blogs)
                child.blogs.map(blog => {
                  if (blog.id === id) {
                    blog.title = title;
                    blog.belongingMenu = belongingMenu;
                  }
                });
              if (child.children)
                child.children.map(grandChild => {
                  if (grandChild.blogs)
                    grandChild.blogs.map(blog => {
                      if (blog.id === id) {
                        blog.title = title;
                        blog.belongingMenu = belongingMenu;
                      }
                    });
                  return grandChild;
                });
              return child;
            });
          return menu;
        }),
      ];
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

export const { addMenu, editMenu, deleteMenu, setSelectedId, addBlogMenu, editBlogMenu } = blogMenuSlice.actions;
export default blogMenuSlice.reducer;
