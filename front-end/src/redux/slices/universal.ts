import { createSlice } from '@reduxjs/toolkit';

interface UniInitState {
  themeMode: 'dark' | 'light';
}

const initialState = {
  themeMode: 'light',
} as UniInitState;

const uniSlice = createSlice({
  name: 'universal',
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
  },
});
export const { setThemeMode } = uniSlice.actions;
export default uniSlice.reducer;
