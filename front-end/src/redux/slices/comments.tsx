import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import service from '@/utils/request';
import { commentObj, commentApiObj, requestOptions } from '@/interface';
import moment from 'moment';

interface commentsState {
  commentList: commentObj[];
  curPage: number;
  isLoading: boolean;
  length: number;
  sort: 'time' | 'hot';
  likeList: string[]; // 用来存放已经点过赞的评论id列表
}

const initialState: commentsState = {
  commentList: [] as commentObj[],
  curPage: 1,
  isLoading: false,
  length: 0,
  sort: 'time',
  likeList: [],
};

export const setComments = createAsyncThunk('comments/setComments', async (options: requestOptions) => {
  const { id, page, sort } = options;
  const response = await service.get(`/api/comments/${id}?page=${page}&sort=${sort ? sort : ''}`);
  return response.data;
});

export const setLength = createAsyncThunk('comments/setLength', async (blogId: string) => {
  const response = await service.get(`/api/comments/getCommentsNum/${blogId}`);
  return response.data;
});

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setCurPage: (state, action) => {
      state.curPage = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    addLength: state => {
      state.length = state.length + 1;
    },
    updateComment: (state, action) => {
      const { id, data } = action.payload;
      state.commentList = state.commentList.map(comment => {
        if (comment.id === id) {
          return Object.assign({}, comment, data);
        } else return comment;
      });
    },
    deleteComment: (state, action) => {
      state.commentList = state.commentList.filter(comment => comment.id !== action.payload);
    },
    addLikeId: (state, action) => {
      state.likeList = [action.payload, ...state.likeList];
    },
    delLikeId: (state, action) => {
      state.likeList = state.likeList.filter(id => action.payload !== id);
    },
  },
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
              time: moment(comment.publishAt).format('YYYY-MM-DD HH:mm:ss'),
              username: comment.username,
              userRole: comment.userRole,
              brief: comment.brief,
              userId: comment.belongingUser,
            };
          });
        else state.commentList = []; // 解决切换bug，不是异步的问题，是忘记在没有评论时修改state了
      })
      .addCase(setComments.rejected, (state, action) => {
        console.log(action.error.message);
      })
      .addCase(setLength.fulfilled, (state, action) => {
        state.length = action.payload.data.length;
      })
      .addCase(setLength.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export const { setCurPage, setIsLoading, setSort, addLength, updateComment, addLikeId, delLikeId, deleteComment } =
  commentsSlice.actions;
export default commentsSlice.reducer;
