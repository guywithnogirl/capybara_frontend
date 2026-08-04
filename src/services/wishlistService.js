import api from './api';

export const getWishlist = async () => {
  const { data } = await api.get('/wishlist/');
  return data;
};

export const addToWishlist = async (product_variant) => {
  const { data } = await api.post('/wishlist/add/', { product_variant });
  return data;
};

export const removeFromWishlist = async (pk) => {
  await api.delete(`/wishlist/items/${pk}/`);
};
