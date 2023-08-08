import { createSlice } from '@reduxjs/toolkit';

interface UniInitState {
  themeMode: 'dark' | 'light';
  jumpFlag: boolean;
}

const initialState = {
  themeMode: 'light',
  jumpFlag: false, // 跳转标志，用来表示页面是否处于跳转（作为useEffect依赖使用）
} as UniInitState;

const uniSlice = createSlice({
  name: 'universal',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setJumpFlag: (state, action) => {
      state.jumpFlag = action.payload;
    },
  },
});
export const { setThemeMode, setJumpFlag } = uniSlice.actions;
export default uniSlice.reducer;
