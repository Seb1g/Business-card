import {generateAddress, getAddresses, getInbox, deleteAddress} from '../../../shared/config/mailApi.ts';
import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || 'Ошибка запроса';
  }
  return 'Неизвестная ошибка';
};

export const createAddressThunk = createAsyncThunk<
  { address: string },
  void,
  { rejectValue: string }
>('mail/create_address', async (_, {rejectWithValue}) => {
  try {
    const response = await generateAddress()
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})

export const getAddressesThunk = createAsyncThunk<
  { id: number, address: string, created_at: string }[],
  void,
  { rejectValue: string }
>('mail/get_addresses', async (_, {rejectWithValue}) => {
  try {
    const response = await getAddresses()
    return response.data;
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
  { address_id: number },
  { rejectValue: string }
>('mail/get_inbox', async (address_id, {rejectWithValue}) => {
  try {
    const response = await getInbox(address_id.address_id)
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})

export const deleteAddressThunk = createAsyncThunk<
  void,
  { address_id: number },
  { rejectValue: string }
>('mail/delete_address', async (address_id, {rejectWithValue}) => {
  try {
    const response = await deleteAddress(address_id.address_id);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
})
