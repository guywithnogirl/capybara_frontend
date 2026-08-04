import api from './api';

export const getProductReviews = async (productId) => {
  const { data } = await api.get(`/reviews/product/${productId}/`);
  return data;
};

export const createReview = async ({ product_id, rating, comment }) => {
  const { data } = await api.post('/reviews/', { product_id, rating, comment });
  return data;
};

export const updateReview = async (pk, { rating, comment }) => {
  const { data } = await api.put(`/reviews/${pk}/`, { rating, comment });
  return data;
};

export const deleteReview = async (pk) => {
  await api.delete(`/reviews/${pk}/`);
};
