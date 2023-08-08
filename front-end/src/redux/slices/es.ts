import { createSlice } from '@reduxjs/toolkit';
import { SearchHistoryObj } from '@/interface/es';

interface ESInitialState {
  history: SearchHistoryObj[];
}

const initialState = {
  history: [],
} as ESInitialState;

const esSlice = createSlice({
  name: 'es',
  initialState,
  reducers: {
    addHistory: (state, action) => {
      const has = state.history.find(history => history.blog.blog_id === action.payload.blog.blog_id);
      if (!has) state.history = [action.payload, ...state.history];
    },
    delHistory: (state, action) => {
      state.history = state.history.filter(history => {
        return history.blog.blog_id !== action.payload;
      });
    },
  },
});

export const { addHistory, delHistory } = esSlice.actions;
export default esSlice.reducer;
