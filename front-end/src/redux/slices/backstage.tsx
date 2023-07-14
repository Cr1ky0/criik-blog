import { createSlice } from '@reduxjs/toolkit';

interface BackStageInit {
  selectKey: string;
}

// 合并了菜单的slice因为无法解决设置了selectedId后设置curBlog延迟的问题
const initialState: BackStageInit = {
  selectKey: '', // 当前选中的key
};

const backStageSlice = createSlice({
  name: 'backstage',
  initialState,
  reducers: {
    setSelectKey: (state, action) => {
      state.selectKey = action.payload;
    },
  },
});

export const { setSelectKey } = backStageSlice.actions;
export default backStageSlice.reducer;
