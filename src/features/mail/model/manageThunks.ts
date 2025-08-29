import {
  addMailAddress,
  type addMailAddressCredentials,
  deleteAllEmailAddresses,
  deleteMailAddress
} from '../../../shared/config/mailApi.ts';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Ошибка запроса';
  }
  return 'Неизвестная ошибка';
};

interface addMailAddressResponse {
  address?: string;
  status?: string;
  error?: string;
}

export const addMailAddressThunk = createAsyncThunk<
  addMailAddressResponse,
  addMailAddressCredentials,
  { rejectValue: string }
>('address/addNewAddress', async (credentials, {rejectWithValue}) => {
  try {
    const response = await addMailAddress(credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteMailAddressThunk = createAsyncThunk<
  { status: string },
  { id: string },
  { rejectValue: string }
>('address/deleteAddress', async (credentials, {rejectWithValue}) => {
  try {
    const response = await deleteMailAddress(credentials.id);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const deleteAllAddressesThunk = createAsyncThunk<
  { status: string },
  void,
  { rejectValue: string }
>('address/deleteAllAddresses', async (_, {rejectWithValue}) => {
  try {
    const response = await deleteAllEmailAddresses();
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})
