import {createAsyncThunk} from "@reduxjs/toolkit";
import {
  createCard,
  createColumn, deleteCard,
  deleteColumn,
  getOneBoard,
  updateBoard, updateCard,
  updateColumn
} from "../../../../../shared/config/trelloApi.ts";
import {AxiosError} from "axios";
import type {Columns} from "../slices/kanbanSlice.ts";

export const getOneBoardThunk = createAsyncThunk(
  "trello/get_one_board",
  async ({board_id, user_id}: {board_id: string, user_id: number}, {rejectWithValue}) => {
    try {
      const response = await getOneBoard(board_id, user_id);
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const updateBoardThunk = createAsyncThunk(
  "kanban/updateBoard",
  async ({ board_id, user_id, columns }: {board_id: string, user_id: number, columns: Columns[]}, {rejectWithValue}) => {
    try {
      const response = await updateBoard({board_id: board_id, user_id: user_id, board_data: columns});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const renameColumnThunk = createAsyncThunk(
  "kanban/updateColumn",
  async ({ board_id, column_id, new_name }: {board_id: string, column_id: string, new_name: string}, {rejectWithValue}) => {
    try {
      const response = await updateColumn({board_id: board_id, column_id: column_id, new_name: new_name});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
);

export const createColumnThunk = createAsyncThunk(
  "kanban/createColumn",
  async ({board_id, column_title}: {board_id: string, column_title: string}, {rejectWithValue}) => {
    try {
      const response = await createColumn({board_id: board_id, column_title: column_title});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof  AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)

export const deleteColumnThunk = createAsyncThunk(
  "kanban/deleteColumn",
  async ({board_id, column_id}: {board_id: string, column_id: string}, {rejectWithValue}) => {
    try {
      const response = await deleteColumn({board_id: board_id, column_id: column_id});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof  AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)

export const createCardThunk = createAsyncThunk(
  "kanban/createCard",
  async ({column_id, card_title}: {column_id: string, card_title: string}, {rejectWithValue}) => {
    try {
      const response = await createCard({column_id: column_id, card_title: card_title});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof  AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)

export const renameCardThunk = createAsyncThunk(
  "kanban/renameCard",
  async ({column_id, card_id, new_name}: {column_id: string, card_id: string, new_name: string}, {rejectWithValue}) => {
    try {
      const response = await updateCard({column_id: column_id, card_id: card_id, new_name: new_name});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof  AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)

export const deleteCardThunk = createAsyncThunk(
  "kanban/deleteCard",
  async ({column_id, card_id}: {column_id: string, card_id: string}, {rejectWithValue}) => {
    try {
      const response = await deleteCard({column_id: column_id, card_id: card_id});
      return response.data;
    } catch (e: unknown) {
      if (e instanceof  AxiosError) {
        return rejectWithValue(e.response?.data?.message);
      }
      return rejectWithValue("Unexpected error");
    }
  }
)
