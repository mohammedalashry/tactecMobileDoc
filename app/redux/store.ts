import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
// import storage from 'redux-persist/lib/storage';
import AsyncStorage from "@react-native-async-storage/async-storage";

import loginSlice from "./slices/login/loginSlice";
import playgroundSlice from "./slices/playground/playgroundSlice";
import matchesSlice from "./slices/matches/MatchSlice";
import langSlice from "./slices/lang/langSlice";
import TacticalPlayers from "./slices/players/TacticalPlayers";
const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    login: loginSlice,
    playground: playgroundSlice,
    matches: matchesSlice,
    lang: langSlice,
    tacticalPlayers: TacticalPlayers,
  })
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
