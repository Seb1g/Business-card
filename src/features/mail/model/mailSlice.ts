import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import {
  deleteAllMailsThunk,
  deleteOneMailThunk,
  getDomainThunk,
  getMailAddressesThunk,
  getMailDataThunk,
  mailsListThunk
} from "./mailThunks.ts";

interface Domain {
  domain: string;
}

// interface Address {
//   addr: string;
// }

interface Mail {
  id: string;
  sender: string;
  subject: string;
}

interface MailData {
  sender: string;
  subject: string;
  content: string;
}

interface DeleteOneMail {
  status: string;
}

interface DeleteAllMails {
  status: string;
}

interface MailState {
  domainName: Domain | null;
  domainLoading: boolean;
  domainError: string | null;

  addresses: string[];
  addressesLoading: boolean;
  addressesError: string | null;

  mails: Mail[] | null;
  mailsLoading: boolean;
  mailsError: string | null;

  mailData: MailData | null;
  mailDataLoading: boolean;
  mailDataError: string | null;

  deleteOneMail: DeleteOneMail | null,
  deleteOneMailLoading: boolean,
  deleteOneMailError: string | null,

  deleteAllMails: DeleteAllMails | null,
  deleteAllMailsLoading: boolean,
  deleteAllMailsError: string | null,

  selectedAddress: string;
  page: number;
}

const initialState: MailState = {
  domainName: null,
  domainLoading: false,
  domainError: null,

  addresses: [],
  addressesLoading: false,
  addressesError: null,

  mails: null,
  mailsLoading: false,
  mailsError: null,

  mailData: null,
  mailDataLoading: false,
  mailDataError: null,

  deleteOneMail: null,
  deleteOneMailLoading: false,
  deleteOneMailError: null,

  deleteAllMails: null,
  deleteAllMailsLoading: false,
  deleteAllMailsError: null,

  selectedAddress: '',
  page: 1,
};


const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddress = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearMailData: (state) => {
      state.mailData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getDomainThunk.pending, (state) => {
      state.domainLoading = true;
      state.domainError = null;
    });
    builder.addCase(getDomainThunk.fulfilled, (state, action: PayloadAction<Domain>) => {
      state.domainLoading = false;
      state.domainName = action.payload;
    });
    builder.addCase(getDomainThunk.rejected, (state, action) => {
      state.domainLoading = false;
      state.domainError = action.payload || 'Error';
    });
    builder.addCase(getMailAddressesThunk.pending, (state) => {
      state.addressesLoading = true;
      state.addressesError = null;
    });
    builder.addCase(getMailAddressesThunk.fulfilled, (state, action: PayloadAction<string[]>) => {
      state.addressesLoading = false;
      state.addresses = action.payload;
      if (action.payload.length !== 0) {
        state.selectedAddress = action.payload[0];
      }
    });
    builder.addCase(getMailAddressesThunk.rejected, (state, action) => {
      state.addressesLoading = false;
      state.addressesError = action.payload || 'Error';
    });
    builder.addCase(mailsListThunk.pending, (state) => {
      state.mailsLoading = true;
      state.mailsError = null;
    });
    builder.addCase(mailsListThunk.fulfilled, (state, action: PayloadAction<Mail[]>) => {
      state.mailsLoading = false;
      state.mails = action.payload;
    });
    builder.addCase(mailsListThunk.rejected, (state, action) => {
      state.mailsLoading = false;
      state.mailsError = action.payload || 'Error';
    });
    builder.addCase(getMailDataThunk.pending, (state) => {
      state.mailDataLoading = true;
      state.mailDataError = null;
    });
    builder.addCase(getMailDataThunk.fulfilled, (state, action: PayloadAction<MailData>) => {
      state.mailDataLoading = false;
      state.mailData = action.payload;
    });
    builder.addCase(getMailDataThunk.rejected, (state, action) => {
      state.mailDataLoading = false;
      state.mailDataError = action.payload || 'Error';
    });
    builder.addCase(deleteOneMailThunk.pending, (state) => {
      state.deleteOneMailLoading = true;
      state.deleteOneMailError = null;
    });
    builder.addCase(deleteOneMailThunk.fulfilled, (state, action: PayloadAction<DeleteOneMail>) => {
      state.deleteOneMailLoading = false;
      state.deleteOneMail = action.payload;
    });
    builder.addCase(deleteOneMailThunk.rejected, (state, action) => {
      state.deleteOneMailLoading = false;
      state.deleteOneMailError = action.payload || 'Error';
    });
    builder.addCase(deleteAllMailsThunk.pending, (state) => {
      state.deleteAllMailsLoading = true;
      state.deleteAllMailsError = null;
    });
    builder.addCase(deleteAllMailsThunk.fulfilled, (state, action: PayloadAction<DeleteAllMails>) => {
      state.deleteAllMailsLoading = false;
      state.deleteAllMails = action.payload;
    });
    builder.addCase(deleteAllMailsThunk.rejected, (state, action) => {
      state.deleteAllMailsLoading = false;
      state.deleteAllMailsError = action.payload || 'Error';
    });
  }
});


export const {setSelectedAddress, setPage, clearMailData} = mailSlice.actions;
export default mailSlice.reducer;
