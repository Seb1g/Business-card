import {
  deleteAllMails, deleteMailId,
  getDomain,
  getMailAddresses, mailDataId,
  type mailDataIdCredentials,
  mailsList,
  type mailsListCredentials
} from '../../../shared/config/mailApi.ts';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Ошибка запроса';
  }
  return 'Неизвестная ошибка';
};

export const getDomainThunk = createAsyncThunk<
  { domain: string },
  void,
  { rejectValue: string }
>('domain/getDomain', async (_, {rejectWithValue}) => {
  try {
    const response = await getDomain();
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const getMailAddressesThunk = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>('address/getAllAddresses', async ( _,{rejectWithValue}) => {
  try {
    const response = await getMailAddresses();
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

interface mailsListResponse {
  id: string;
  sender: string;
  subject: string;
}

export const mailsListThunk = createAsyncThunk<
  mailsListResponse[],
  mailsListCredentials,
  { rejectValue: string }
>('mail/getAllMails', async (credentials, {rejectWithValue}) => {
  try {
    const response = await mailsList(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

interface mailDataResponse {
  sender: string;
  subject: string;
  content: string;
}

export const getMailDataThunk = createAsyncThunk<
  mailDataResponse,
  mailDataIdCredentials,
  { rejectValue: string }
>('mail/getOneMailData', async (credentials, {rejectWithValue}) => {
  try {
    const response = await mailDataId(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteOneMailThunk = createAsyncThunk<
  {status: string},
  {id: string},
  { rejectValue: string }
>('mail/deleteOneMail', async (credentials, {rejectWithValue}) => {
  try {
    const response = await deleteMailId(credentials.id);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteAllMailsThunk = createAsyncThunk<
  {status: string},
  {address: string},
  { rejectValue: string }
>('mail/deleteAllMails', async (credentials, {rejectWithValue}) => {
  try {
    const response = await deleteAllMails(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});
