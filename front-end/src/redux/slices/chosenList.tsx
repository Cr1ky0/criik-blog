import { createSlice } from '@reduxjs/toolkit';

const initialState = { chosenList: [true, false, false, false] };

const chosenListSlice = createSlice({
  name: 'chosenList',
  initialState,
  reducers: {
    setChosenList: (state, action) => {
      state.chosenList = [...action.payload];
    },
  },
});

export const { setChosenList } = chosenListSlice.actions;

export default chosenListSlice.reducer;
