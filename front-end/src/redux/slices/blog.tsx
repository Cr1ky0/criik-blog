import service from '@/utils/request';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// interface
import { blogObj } from '@/interface';

const initialState = {
  curBlog: {} as blogObj,
};

export const setCurBlog = createAsyncThunk('blog/setCurBlog', async (id: string) => {
  const response = await service.get(`/api/blogs/${id}`);
  return response.data.data;
});

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(setCurBlog.fulfilled, (state, action) => {
      // 由于这里后端做了防止注入的措施，html代码被转换掉了，需要进行一些处理
      const newContents = action.payload.blog.contents.replaceAll('&lt;', '<');
      console.log(newContents);
      state.curBlog = Object.assign({}, action.payload.blog, { contents: newContents });
    });
  },
});

export default blogSlice.reducer;
