import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import emoji from './slices/emoji';
import chosenList from './slices/chosenList';
import blogMenu from './slices/blogMenu';
import blog from './slices/blog';
import comments from './slices/comments';
//持久存储
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
  emoji,
  chosenList,
  blogMenu,
  blog,
  comments,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: ['comments'],
};
const persistReducers = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };

// 声明类别，全局返回声明后的hook
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
