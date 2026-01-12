import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {login, logout, refresh, register} from "../../../shared/config/authApi.ts";
import type {AuthResponse, IUser} from "../../../shared/config/authApi.ts";

const setTokensInStorage = (data: AuthResponse) => {
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
};

const getRefreshToken = (): string | null => localStorage.getItem("refresh_token");

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({email, password}: { email: string; password: string }, {rejectWithValue}) => {
    try {
      const response = await login({email, password});
      setTokensInStorage(response.data);
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const registrationThunk = createAsyncThunk(
  "auth/registration",
  async ({email, password}: { email: string; password: string }, {rejectWithValue}) => {
    try {
      const response = await register({email, password});
      setTokensInStorage(response.data);
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const logoutThunk = createAsyncThunk("auth/logout", async (_, {rejectWithValue}) => {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await logout();
    }

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return {} as IUser;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message);
    }
    return rejectWithValue("Unexpected error");
  }
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, {rejectWithValue}) => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return rejectWithValue("No refresh token found");
    }

    const response = await refresh(refreshToken)

    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);

    return response.data;
  } catch (e: unknown) {
    if (e instanceof AxiosError) {
      return rejectWithValue(e.response?.data?.message || "Refresh token invalid or expired");
    }
    return rejectWithValue("Unexpected error");
  }
});
