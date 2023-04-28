import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '@/utils/request';
import { commentObj } from '@/interface';

const initialState = {
  commentList: [] as commentObj[],
};

interface commentApiObj {
  _id: string;
  contents: string;
  likes: number;
  publishAt: string;
  belongingUser: string;
  belongingBlog: string;
  username: string;
  brief: string;
}

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
        const comments = action.payload.data.comments.comments;
        if (comments.length)
          state.commentList = comments.map((comment: commentApiObj) => {
            return {
              id: comment._id,
              contents: comment.contents,
              likes: comment.likes,
              time: comment.publishAt.split('T')[0],
              username: comment.username,
              brief: comment.brief,
            };
          });
      })
      .addCase(setComments.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default commentsSlice.reducer;
