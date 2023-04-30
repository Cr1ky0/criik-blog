import service from '@/utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// interface
import { blogObj, SideMenuItem, textContentObj } from '@/interface';
import { getOneBlogId } from '@/utils';

interface blogInitObj {
  menuList: SideMenuItem[];
  selectedId: string; // 选的博客id
  curBlog: blogObj;
  writeContent: textContentObj;
  isEdit: boolean; // 标志博客是否处于编辑状态，处于编辑状态则提交按钮变为更新
  views: number;
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: blogInitObj = {
  menuList: [] as SideMenuItem[],
  selectedId: '', // 选的博客id
  curBlog: {} as blogObj,
  writeContent: {} as textContentObj,
  isEdit: false, // 标志博客是否处于编辑状态，处于编辑状态则提交按钮变为更新
  views: 0,
};

export const setCurBlog = createAsyncThunk('blog/setCurBlog', async (id: string) => {
  const response = await service.get(`/api/blogs/${id}`);
  return response.data.data;
});

export const setMenuList = createAsyncThunk('blogMenu/setMenuList', async () => {
  const response = await service.get(`api/menus`);
  const menus = response.data.body.menus;
  // 设置一个初始选中项
  const blogId = getOneBlogId(menus) || '';
  if (blogId) {
    const res = await service.get(`/api/blogs/${blogId}`);
    return { menus, blogId, blog: res.data.data.blog };
  } else {
    return { menus, blogId };
  }
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // views
    setViews: (state, action) => {
      state.views = action.payload;
    },
    // curBlog
    updateCurBlog: (state, action) => {
      state.curBlog = Object.assign({}, state.curBlog, action.payload);
    },
    // isEdit
    setIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    // writeContent
    setTitle: (state, action) => {
      state.writeContent.title = action.payload;
    },
    setMenuId: (state, action) => {
      state.writeContent.menuId = action.payload;
    },
    setMenuTitle: (state, action) => {
      state.writeContent.menuTitle = action.payload;
    },
    setContent: (state, action) => {
      state.writeContent.content = action.payload;
    },
    initWriteContent: state => {
      state.writeContent = {
        title: '',
        menuId: '',
        menuTitle: '',
        content: '',
      };
    },
    setAllContent: (state, action) => {
      state.writeContent = action.payload;
    },
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
      .addCase(setCurBlog.fulfilled, (state, action) => {
        // 由于这里后端做了防止注入的措施，html代码被转换掉了，需要进行一些处理
        const newContents = action.payload.blog.contents.replaceAll('&lt;', '<');
        state.curBlog = Object.assign({}, action.payload.blog, { contents: newContents });
        state.views = action.payload.blog.views;
      })
      .addCase(setCurBlog.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(setMenuList.fulfilled, (state, action) => {
        const { menus, blogId, blog } = action.payload;
        state.menuList = [...menus];
        if (!state.selectedId) state.selectedId = blogId;
        if (blog) {
          const newContents = blog.contents.replaceAll('&lt;', '<');
          state.curBlog = Object.assign({}, blog, { contents: newContents });
          state.views = blog.views;
        }
      })
      .addCase(setMenuList.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const {
  setViews,
  updateCurBlog,
  setIsEdit,
  setTitle,
  setMenuTitle,
  setMenuId,
  setContent,
  initWriteContent,
  setAllContent,
  addMenu,
  editMenu,
  deleteMenu,
  setSelectedId,
  addBlogMenu,
} = blogSlice.actions;
export default blogSlice.reducer;
