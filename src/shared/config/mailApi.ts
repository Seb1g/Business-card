import apiClient from '../api/createApi';

export interface mailsListCredentials {
  addr: string;
  page: number;
}

export interface mailDataIdCredentials {
  id: string;
}

export interface deleteAllMailsCredentials {
  address: string;
}

export const mailsList = (credentials: mailsListCredentials) => {
  return apiClient.post('/api/mails/list', credentials);
};

export const mailDataId = (credentials: mailDataIdCredentials) => {
  return apiClient.post('/api/mails/data', credentials);
};

export const deleteMailId = (id: string) => {
  return apiClient.delete(`/api/mails/${id}`);
}

export const deleteAllMails = (credentials: deleteAllMailsCredentials) => {
  return apiClient.post('/api/mails/deleteAll', credentials);
}

export interface addMailAddressCredentials {
  address: string;
}

export const getMailAddresses = () => {
  return apiClient.get('/api/addresses/');
}

export const addMailAddress = (credentials: addMailAddressCredentials) => {
  return apiClient.post('/api/addresses/', credentials);
}

export const deleteMailAddress = (id: string) => {
  return apiClient.delete(`/api/addresses/${id}`);
}

export const deleteAllEmailAddresses = () => {
  return apiClient.delete(`/api/addresses/`);
}

export const getDomain = () => {
  return apiClient.get('/api/domain/');
}
