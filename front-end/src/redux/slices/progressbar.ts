import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  fadeOut: false,
};

const progressbarSlice = createSlice({
  name: 'progressbar',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFadeOut: (state, action) => {
      state.fadeOut = action.payload;
    },
  },
});
export const { setIsLoading, setFadeOut } = progressbarSlice.actions;
export default progressbarSlice.reducer;
