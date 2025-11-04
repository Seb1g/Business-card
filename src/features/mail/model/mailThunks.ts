import {getAddressAndEmails, newEmail} from '../../../shared/config/mailApi.ts';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Ошибка запроса';
  }
  return 'Неизвестная ошибка';
};

interface Response {
  address: string,
  token: string
}

export const createNewMailThunk = createAsyncThunk<
  Response,
  void,
  { rejectValue: string }
>('mail/add_mail', async (_, {rejectWithValue}) => {
  try {
    const response = await newEmail()
    const userData = response.data

    let flag = false;
    while (!flag) {
      // eslint-disable-next-line no-constant-condition
      for (let i = 1; 1 <= 50; i++) {
        if (localStorage.getItem(`token${i}`) === null) {
          localStorage.setItem(`token${i}`, JSON.stringify(userData));
          flag = true;
          break;
        }
      }
    }

    return userData;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})

export const getInboxThunk = createAsyncThunk<
  {
    id: number,
    sender: string,
    recipients: [
      string
    ],
    subject: string,
    body: string,
    received_at: string
  }[],
  { token: string },
  { rejectValue: string }
>('mail/get_inbox', async (token, {rejectWithValue}) => {
  try {
    const response = await getAddressAndEmails(token)
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})
