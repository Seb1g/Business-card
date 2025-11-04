import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {deleteBoardThunk, getAllBoardThunk, renameBoardThunk} from "../thunks/dashboardThunk.ts";

export interface Board {
  id: string;
  userId: number;
  title: string;
}

export interface updated_board {
  id: string;
  title: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface BoardsState {
  boards: Board[];
  updated_board: updated_board | [];
  deleted_board: {message: string} | object;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  boards: [],
  updated_board: [],
  deleted_board: {},
  loading: false,
  error: null,
};

const getUserBoardsSlice = createSlice({
  name: 'getUserBoards',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(getAllBoardThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllBoardThunk.fulfilled, (state, action: PayloadAction<Board[]>) => {
      state.loading = false;
      state.boards = action.payload;
    });
    builder.addCase(getAllBoardThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string | undefined)
        || action.error.message
        || 'Ошибка получения досок';
    });
    builder.addCase(renameBoardThunk.fulfilled, (state, action) => {
      state.updated_board = action.payload
    })
    builder.addCase(deleteBoardThunk.fulfilled, (state, action) => {
      state.deleted_board = action.payload
    })
  },
});

export default getUserBoardsSlice.reducer;
