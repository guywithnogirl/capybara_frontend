import api from './api';

export const getCategories = async () => {
  const { data } = await api.get('/categories/');
  return data;
};

export const getCategoryBySlug = async (slug) => {
  const { data } = await api.get(`/categories/${slug}/`);
  return data;
};
