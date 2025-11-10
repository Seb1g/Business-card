import {configureStore} from '@reduxjs/toolkit';
import {useDispatch, useSelector, type TypedUseSelectorHook} from 'react-redux';
import MailSlice from "../features/mail/model/mailSlice.ts";
import AuthSlices from "../features/auth/model/authSlices.ts";
import DashboardSlice from "../features/trello/model/dashboard/slices/dashboardSlice.ts";
import KanbanSlice from "../features/trello/model/kanban/slices/kanbanSlice.ts";
import getCategoriesSlice from "../features/quiz/model/quizDashboard/getCategoriesSlice.ts";
import getQuestionsSlice from "../features/quiz/model/quizlet/getQuestionsSlice.ts";

export const store = configureStore({
  reducer: {
    mail: MailSlice,
    auth: AuthSlices,
    trelloDashboard: DashboardSlice,
    trelloKanban: KanbanSlice,
    quizCategories: getCategoriesSlice,
    quizQuestions: getQuestionsSlice,
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
