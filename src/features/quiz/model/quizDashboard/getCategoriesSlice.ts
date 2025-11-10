import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {type GetCategoriesResponse, getCategoriesThunk} from "./getCategoriesThunk.ts";


interface QuizState {
  categories: GetCategoriesResponse | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
}

const initialState: QuizState = {
  categories: null,
  categoriesLoading: false,
  categoriesError: null,
};


const categoriesSlice = createSlice({
  name: 'quiz_categories',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    // Get all categories
    builder.addCase(getCategoriesThunk.pending, (state) => {
      state.categoriesLoading = true;
      state.categoriesError = null;
    });
    builder.addCase(getCategoriesThunk.fulfilled, (state, action: PayloadAction<GetCategoriesResponse>) => {
      state.categoriesLoading = false;
      state.categories = action.payload;
    });
    builder.addCase(getCategoriesThunk.rejected, (state, action) => {
      state.categoriesLoading = false;
      state.categoriesError = action.payload || 'Error';
    });
  }
});

export default categoriesSlice.reducer;
