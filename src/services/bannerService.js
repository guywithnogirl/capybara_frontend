import api from './api';

export const getBanners = async () => {
  const { data } = await api.get('/banners/');
  return data;
};
