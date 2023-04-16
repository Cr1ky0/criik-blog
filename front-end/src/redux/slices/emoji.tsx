import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// interface
import { EmojiObj } from '@/interface';

const URL = 'http://localhost:3002/';
const initialState = {
  emojiList: [] as EmojiObj[],
};

// async
// 这里只发送请求不处理数据，数据在extraReducer内处理
export const setEmoji = createAsyncThunk('emoji/setEmoji', async () => {
  const response = await axios.get(`${URL}emoji.json`);
  return response.data;
});
export const emoji = createSlice({
  name: 'emoji',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setEmoji.fulfilled, (state, action) => {
        // 将json转化为对象
        const list: EmojiObj[] = [];
        Object.entries(action.payload).map(([key, value]) => {
          list.push({ key, value } as EmojiObj);
        });
        state.emojiList = [...list];
      })
      .addCase(setEmoji.rejected, (state, action) => {
        console.log(action.error.message);
      });
  },
});

export default emoji.reducer;
