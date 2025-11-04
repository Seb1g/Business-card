import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {getOneBoardThunk} from "../thunks/kanbanThunk.ts";

export interface Cards {
  id: string;
  content: string;
  column_id: string;
  position: number;
}

export interface Columns {
  id: string;
  title: string;
  position: number;
  cards: Cards[] | null;
}

export interface Board {
  id: string;
  title: string;
  columns: Columns[]
}

export interface BoardsState {
  board: Board | null;
  loading: boolean;
  error: string | null;
}

const initialState: BoardsState = {
  board: null,
  loading: false,
  error: null,
};

const getUserBoardSlice = createSlice({
  name: 'getUserBoard',
  initialState,
  reducers: {
    updateBoardLocal: (state, action) => {
      state.board = action.payload;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(getOneBoardThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOneBoardThunk.fulfilled, (state, action: PayloadAction<Board>) => {
      state.loading = false;
      state.board = action.payload;
    });
    builder.addCase(getOneBoardThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string | undefined)
        || action.error.message
        || 'Ошибка получения досок';
    });
  },
});

export default getUserBoardSlice.reducer;
export const {updateBoardLocal} = getUserBoardSlice.actions;
