import apiClient from '../api/createApi';

export const newEmail = () => {
  return apiClient.post('/api/v1/mail/addresses');
}

interface getInboxCredentials {
  token: string;
}

export const getAddressAndEmails = (credentials: getInboxCredentials) => {
  return apiClient.get(`/api/v1/mail/inbox`, {
    headers: {
      Authorization: `Bearer ${credentials.token}`
    }
  });
}
