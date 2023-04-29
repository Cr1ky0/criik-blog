import service from '@/utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// interface
import { blogObj, textContentObj } from '@/interface';

const initialState = {
  curBlog: {} as blogObj,
  writeContent: {} as textContentObj,
};

export const setCurBlog = createAsyncThunk('blog/setCurBlog', async (id: string) => {
  const response = await service.get(`/api/blogs/${id}`);
  return response.data.data;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
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
  },
  extraReducers(builder) {
    builder.addCase(setCurBlog.fulfilled, (state, action) => {
      // 由于这里后端做了防止注入的措施，html代码被转换掉了，需要进行一些处理
      const newContents = action.payload.blog.contents.replaceAll('&lt;', '<');
      state.curBlog = Object.assign({}, action.payload.blog, { contents: newContents });
    });
  },
});

export const { setTitle, setMenuTitle, setMenuId, setContent, initWriteContent } = blogSlice.actions;
export default blogSlice.reducer;
