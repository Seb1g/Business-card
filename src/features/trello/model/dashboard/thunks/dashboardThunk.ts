import {createAsyncThunk} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {createBoard, deleteBoard, getAllBoard, renameBoard} from "../../../../../shared/config/trelloApi.ts";

export const createBoardThunk = createAsyncThunk(
  "trello/create_board",
  async ({title, user_id}: { title: string; user_id: number }, {rejectWithValue}) => {
    try {
      const response = await createBoard({title, user_id});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const getAllBoardThunk = createAsyncThunk(
  "trello/get_all_board",
  async ({user_id}: {user_id: number}, {rejectWithValue}) => {
    try {
      const response = await getAllBoard(user_id);
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const renameBoardThunk = createAsyncThunk(
  "trello/rename_board",
  async ({board_id, user_id, new_name}: {board_id: string, user_id: number, new_name: string}, {rejectWithValue}) => {
    try {
      const response = await renameBoard({board_id, user_id, new_name});
      return response.data;
    }
    catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)

export const deleteBoardThunk = createAsyncThunk(
  "trello/delete_board",
  async ({board_id, user_id}: {board_id: string, user_id: number}, {rejectWithValue}) => {
    try {
      const response = await deleteBoard({board_id, user_id});
      return response.data;
    }
    catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)
