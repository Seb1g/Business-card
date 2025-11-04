import {createSlice} from "@reduxjs/toolkit";
import type {IUser} from "../../../shared/api/createApi.ts";
import {checkAuth, loginThunk, logoutThunk, registrationThunk} from "./authThunks.ts";

const initialState = {
  user: {} as IUser,
  isAuth: false,
  isLoading: false,
  isLoginError: "",
  isRegistrationError: "",
  isAuthChecked: false
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthChecked(state) {
      state.isAuthChecked = true;
    },
    clearLoginError(state) {
      state.isLoginError = "";
    },
    clearRegistrationError(state) {
      state.isRegistrationError = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoginError = "";
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user_data;
        state.isLoginError = "";
        state.isLoading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isAuth = false;
        state.user = {} as IUser;
        state.isLoading = false;

        const errorMessage = action.payload as string | undefined;
        state.isLoginError = errorMessage || action.error.message || "Неизвестная ошибка входа";
      })

      .addCase(registrationThunk.pending, (state) => {
        state.isRegistrationError = "";
        state.isLoading = true;
      })
      .addCase(registrationThunk.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user_data;
        state.isRegistrationError = "";
        state.isLoading = false;
      })
      .addCase(registrationThunk.rejected, (state, action) => {
        state.isAuth = false;
        state.user = {} as IUser;
        state.isLoading = false;

        const errorMessage = action.payload as string | undefined;
        state.isRegistrationError = errorMessage || action.error.message || "Неизвестная ошибка регистрации";
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuth = false;
        state.user = {} as IUser;
        state.isLoginError = "";
        state.isRegistrationError = "";
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.isAuthChecked = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user_data;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuth = false;
        state.user = {} as IUser;
        state.isLoading = false;
        state.isAuthChecked = true;
      });
  },
});

export default AuthSlice.reducer;
export const {setAuthChecked, clearLoginError, clearRegistrationError} = AuthSlice.actions;
