import {createAsyncThunk} from "@reduxjs/toolkit";
import {getQuestions, type GetQuestionsCredential} from "../../../../shared/config/quizApi.ts";
import axios from "axios";

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Ошибка запроса';
  }
  return 'Неизвестная ошибка';
};

export interface Question {
  type: string,
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
}

export interface GetQuestionsResponse {
  response_code: number,
  results: Question[]
}

export const getQuestionsThunk = createAsyncThunk<
  GetQuestionsResponse,
  GetQuestionsCredential,
  { rejectValue: string }
>('mail/get_questions', async (credential, {rejectWithValue}) => {
  try {
    const response = await getQuestions({count: credential.count, category: credential.category, difficulty: credential.difficulty, type: credential.type})
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})
