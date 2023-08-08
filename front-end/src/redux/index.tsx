import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

// reducers
import emoji from './slices/emoji';
import chosenList from './slices/chosenList';
import blog from './slices/blog';
import comments from './slices/comments';
import blogMenu from '@/redux/slices/blogMenu';
import user from '@/redux/slices/user';
import backstage from '@/redux/slices/backstage';
import progressbar from '@/redux/slices/progressbar';
import es from '@/redux/slices/es';
import universal from '@/redux/slices/universal';

//持久存储
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
  emoji,
  chosenList,
  blog,
  comments,
  blogMenu,
  user,
  backstage,
  progressbar,
  universal,
  es,
});

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [],
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
