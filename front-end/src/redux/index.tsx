import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import emoji from './slices/emoji';
import chosenList from '@/redux/slices/chosenList';

const store = configureStore({
  reducer: {
    emoji,
    chosenList,
  },
});

export default store;

// 声明类别，全局返回声明后的hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
