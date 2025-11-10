import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCategories} from "../../../../shared/config/quizApi.ts";
import axios from "axios";

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Ошибка запроса';
  }
  return 'Неизвестная ошибка';
};

export interface GetCategoriesResponse {
  trivia_categories: {
    id: number;
    name: string;
  }[]
}

export const getCategoriesThunk = createAsyncThunk<
  GetCategoriesResponse,
  void,
  { rejectValue: string }
>('quiz/get_categories', async (_, {rejectWithValue}) => {
  try {
    const response = await getCategories()
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})
