import { createSlice } from '@reduxjs/toolkit';

// interface
import { SideMenuItem } from '@/interface';

const initialState = {
  menuList: [
    // {
    //   label: 'test',
    //   key: 'test',
    //   icon: 'home',
    //   grade: 1,
    //   children: [
    //     {
    //       label: 'test1',
    //       key: 'test1',
    //       icon: 'code',
    //       grade: 2,
    //       children: [
    //         { label: 'test2', key: 'test2', grade: 3 },
    //         { label: 'test3', key: 'test3', grade: 3 },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   label: 'test4',
    //   key: 'test4',
    //   icon: 'home',
    //   grade: 1,
    //   children: [
    //     { label: 'test5', key: 'test5', grade: 2 },
    //     { label: 'test6', key: 'test6', grade: 2 },
    //     { label: 'test7', key: 'test7', grade: 2 },
    //   ],
    // },
  ] as SideMenuItem[],
};

const blogMenuSlice = createSlice({
  name: 'blogMenu',
  initialState,
  reducers: {},
});

export default blogMenuSlice.reducer;
