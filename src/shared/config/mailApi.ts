import apiClient from '../api/createApi';

export const generateAddress = () => {
  return apiClient.post('/api/v1/mail/addresses');
}

export const getAddresses = () => {
  return apiClient.get('/api/v1/mail/addresses');
}

export const getInbox = (address_id: number) => {
  return apiClient.get(`/api/v1/mail/inbox/${address_id}`);
}

export const deleteAddress = (address_id: number) => {
  return apiClient.delete(`/api/v1/mail/addresses/${address_id}`);
}
