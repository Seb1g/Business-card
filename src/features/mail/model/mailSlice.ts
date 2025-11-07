import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {getAddressesThunk, getInboxThunk} from "./mailThunks.ts";

export interface MailInterface {
  id: number;
  address: string;
  created_at: string;
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
  emails: MailInterface[] | null;
  emailsLoading: boolean;
  emailsError: string | null;

  inbox: InboxInterface[] | null;
  inboxLoading: boolean;
  inboxError: string | null;

  selectedAddress: MailInterface | null;
  selectedEmail: InboxInterface | null;
}

const initialState: MailState = {
  emails: null,
  emailsLoading: false,
  emailsError: null,

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
    // Get all email addresses
    builder.addCase(getAddressesThunk.pending, (state) => {
      state.emailsLoading = true;
      state.emailsError = null;
    });
    builder.addCase(getAddressesThunk.fulfilled, (state, action: PayloadAction<MailInterface[]>) => {
      state.emailsLoading = false;
      state.emails = action.payload;
    });
    builder.addCase(getAddressesThunk.rejected, (state, action) => {
      state.emailsLoading = false;
      state.emailsError = action.payload || 'Error';
    });

    // Get inbox
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
