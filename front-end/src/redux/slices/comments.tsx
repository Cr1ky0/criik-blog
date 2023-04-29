import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '@/utils/request';
import { commentObj, commentApiObj } from '@/interface';

const initialState = {
  commentList: [] as commentObj[],
};

export const setComments = createAsyncThunk('comments/setComments', async (blogId: string) => {
  const response = await service.get(`/api/comments/getCommentsOfBlog/${blogId}`);
  return response.data;
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setComments.fulfilled, (state, action) => {
        const comments = action.payload.data.comments;
        if (comments.length)
          state.commentList = comments.map((comment: commentApiObj) => {
            return {
              id: comment._id,
              contents: comment.contents,
              likes: comment.likes,
              time: comment.publishAt.split('T')[0],
              username: comment.username,
              brief: comment.brief,
              userId: comment.belongingUser,
            };
          });
        else state.commentList = []; // 解决切换bug，不是异步的问题，是忘记在没有评论时修改state了
      })
      .addCase(setComments.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default commentsSlice.reducer;
