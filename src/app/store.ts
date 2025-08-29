import {configureStore} from '@reduxjs/toolkit';
import {useDispatch, useSelector, type TypedUseSelectorHook} from 'react-redux';
import MailSlice from "../features/mail/model/mailSlice.ts";
import manageSlice from "../features/mail/model/manageSlice.ts";

export const store = configureStore({
  reducer: {
    mail: MailSlice,
    manage: manageSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
