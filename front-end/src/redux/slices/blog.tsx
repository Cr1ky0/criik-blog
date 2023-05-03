import service from '@/utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// interface
import { blogObj, textContentObj, timeLineObj } from '@/interface';

interface blogInitObj {
  primBlog: blogObj;
  writeContent: textContentObj;
  isEdit: boolean; // 标志博客是否处于编辑状态，处于编辑状态则提交按钮变为更新
  timeLine: timeLineObj[];
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: blogInitObj = {
  primBlog: {} as blogObj,
  writeContent: {} as textContentObj,
  isEdit: false, // 标志博客是否处于编辑状态，处于编辑状态则提交按钮变为更新
  timeLine: [] as timeLineObj[],
};

export const setTimeLine = createAsyncThunk('blog/setTimeLine', async () => {
  const response = await service.get('/api/blogs/getSelfTimeLine');
  return response.data;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
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
  },
  extraReducers(builder) {
    builder
      .addCase(setTimeLine.fulfilled, (state, action) => {
        state.timeLine = [...action.payload.data.timeLine];
      })
      .addCase(setTimeLine.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const { setIsEdit, setTitle, setMenuTitle, setMenuId, setContent, initWriteContent, setAllContent } =
  blogSlice.actions;
export default blogSlice.reducer;
