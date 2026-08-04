import api from './api';

export const getAddresses = async () => {
  const { data } = await api.get('/addresses/');
  return data;
};

export const createAddress = async (addressData) => {
  const { data } = await api.post('/addresses/', addressData);
  return data;
};

export const updateAddress = async (pk, addressData) => {
  const { data } = await api.put(`/addresses/${pk}/`, addressData);
  return data;
};

export const deleteAddress = async (pk) => {
  await api.delete(`/addresses/${pk}/`);
};

export const setDefaultAddress = async (pk) => {
  const { data } = await api.patch(`/addresses/${pk}/default/`);
  return data;
};
