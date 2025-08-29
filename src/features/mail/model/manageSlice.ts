import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {addMailAddressThunk, deleteAllAddressesThunk, deleteMailAddressThunk} from "./manageThunks.ts";

interface AddMailAddress {
  status: string;
}

interface DeleteMailAddress {
  status: string;
}

interface DeleteAllEmailAddresses {
  status: string;
}

interface MailState {
  addMailAddress: AddMailAddress | null;
  addMailAddressLoading: boolean;
  addMailAddressError: string | null;

  deleteMailAddress: DeleteMailAddress | null;
  deleteMailAddressLoading: boolean;
  deleteMailAddressError: string | null;

  deleteAllEmailAddresses: DeleteAllEmailAddresses | null,
  deleteAllEmailAddressesLoading: boolean,
  deleteAllEmailAddressesError: string | null,

  newMailAddress: string;
}

const initialState: MailState = {
  addMailAddress: null,
  addMailAddressLoading: false,
  addMailAddressError: null,

  deleteMailAddress: null,
  deleteMailAddressLoading: false,
  deleteMailAddressError: null,

  deleteAllEmailAddresses: null,
  deleteAllEmailAddressesLoading: false,
  deleteAllEmailAddressesError: null,

  newMailAddress: ""
};

const manageSlice = createSlice({
  name: 'manage',
  initialState,
  reducers: {
    setNewMailAddress: (state, action: PayloadAction<string>) => {
      state.newMailAddress = action.payload;
    },
    clearAddMailAddressError: (state) => {
      state.addMailAddressError = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(addMailAddressThunk.pending, (state) => {
      state.addMailAddressLoading = true;
      state.addMailAddressError = null;
    });
    builder.addCase(addMailAddressThunk.fulfilled, (state, action: PayloadAction<AddMailAddress>) => {
      state.addMailAddressLoading = false;
      state.addMailAddress = action.payload;
    });
    builder.addCase(addMailAddressThunk.rejected, (state, action) => {
      state.addMailAddressLoading = false;
      state.addMailAddressError = action.payload || 'Error';
    });
    builder.addCase(deleteMailAddressThunk.pending, (state) => {
      state.deleteMailAddressLoading = true;
      state.deleteMailAddressError = null;
    });
    builder.addCase(deleteMailAddressThunk.fulfilled, (state, action: PayloadAction<DeleteMailAddress>) => {
      state.deleteMailAddressLoading = false;
      state.deleteMailAddress = action.payload;
    });
    builder.addCase(deleteMailAddressThunk.rejected, (state, action) => {
      state.deleteMailAddressLoading = false;
      state.deleteMailAddressError = action.payload || 'Error';
    });
    builder.addCase(deleteAllAddressesThunk.pending, (state) => {
      state.deleteAllEmailAddressesLoading = true;
      state.deleteAllEmailAddressesError = null;
    });
    builder.addCase(deleteAllAddressesThunk.fulfilled, (state, action: PayloadAction<DeleteAllEmailAddresses>) => {
      state.deleteAllEmailAddressesLoading = false;
      state.deleteAllEmailAddresses = action.payload;
    });
    builder.addCase(deleteAllAddressesThunk.rejected, (state, action) => {
      state.deleteAllEmailAddressesLoading = false;
      state.deleteAllEmailAddressesError = action.payload || 'Error';
    });
  }
});

export const {
  setNewMailAddress,
  clearAddMailAddressError
} = manageSlice.actions;

export default manageSlice.reducer;
