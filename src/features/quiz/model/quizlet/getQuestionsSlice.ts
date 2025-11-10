import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {type GetQuestionsResponse, getQuestionsThunk} from "./getQuestionsThunk.ts";


interface GetQuestionState {
  questions: GetQuestionsResponse | null;
  questionsLoading: boolean;
  questionsError: string | null;
  categoryQuestions:  string | null;
}

const initialState: GetQuestionState = {
  questions: null,
  questionsLoading: false,
  questionsError: null,
  categoryQuestions: null,
};


const questionsSlice = createSlice({
  name: 'quiz_questions',
  initialState,
  reducers: {
    setCategoryQuestions: (state, action: PayloadAction<string>) => {
      state.categoryQuestions = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Get questions
    builder.addCase(getQuestionsThunk.pending, (state) => {
      state.questionsLoading = true;
      state.questionsError = null;
    });
    builder.addCase(getQuestionsThunk.fulfilled, (state, action: PayloadAction<GetQuestionsResponse>) => {
      state.questionsLoading = false;
      state.questions = action.payload;
    });
    builder.addCase(getQuestionsThunk.rejected, (state, action) => {
      state.questionsLoading = false;
      state.questionsError = action.payload || 'Error';
    });
  }
});

export const {setCategoryQuestions} = questionsSlice.actions;
export default questionsSlice.reducer;
