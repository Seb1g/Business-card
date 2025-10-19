import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {createNewMailThunk, getInboxThunk} from "./mailThunks.ts";

export interface MailInterface {
  address: string,
  token: string
}

export interface InboxInterface {
  id: number,
  sender: string,
  recipients: [
    string
  ],
  subject: string,
  body: string,
  received_at: string
}

interface MailState {
  email: { address: string, token: string } | null;
  emailLoading: boolean;
  emailError: string | null;

  inbox: InboxInterface[] | null;
  inboxLoading: boolean;
  inboxError: string | null;

  selectedAddress: MailInterface | null;
  selectedEmail: InboxInterface | null;
}

const initialState: MailState = {
  email: null,
  emailLoading: false,
  emailError: null,

  inbox: [],
  inboxLoading: false,
  inboxError: null,

  selectedAddress: null,
  selectedEmail: null,
};


const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<MailInterface | null>) => {
      state.selectedAddress = action.payload;
    },
    setSelectedEmail: (state, action: PayloadAction<InboxInterface | null>) => {
      state.selectedEmail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createNewMailThunk.pending, (state) => {
      state.emailLoading = true;
      state.emailError = null;
    });
    builder.addCase(createNewMailThunk.fulfilled, (state, action: PayloadAction<MailInterface>) => {
      state.emailLoading = false;
      state.email = action.payload;
    });
    builder.addCase(createNewMailThunk.rejected, (state, action) => {
      state.emailLoading = false;
      state.emailError = action.payload || 'Error';
    });
    builder.addCase(getInboxThunk.pending, (state) => {
      state.inboxLoading = true;
      state.inboxError = null;
    });
    builder.addCase(getInboxThunk.fulfilled, (state, action: PayloadAction<InboxInterface[]>) => {
      state.inboxLoading = false;
      state.inbox = action.payload;
    });
    builder.addCase(getInboxThunk.rejected, (state, action) => {
      state.inboxLoading = false;
      state.inboxError = action.payload || 'Error';
    });
  }
});


export const {setSelectedAddress, setSelectedEmail} = mailSlice.actions;
export default mailSlice.reducer;
