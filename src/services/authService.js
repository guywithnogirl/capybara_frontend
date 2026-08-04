import api, { setTokens, clearTokens } from './api';

export const loginUser = async (email, password) => {
  const { data } = await api.post('/accounts/login/', { email, password });
  setTokens(data.access, data.refresh);
  return data;
};

export const registerUser = async ({ first_name, last_name, username, email, phone_number, password }) => {
  const { data } = await api.post('/accounts/register/', {
    first_name,
    last_name,
    username,
    email,
    phone_number,
    password,
  });
  return data;
};

export const logoutUser = () => {
  clearTokens();
};
