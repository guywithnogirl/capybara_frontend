import api from './api';

export const getCart = async () => {
  const { data } = await api.get('/cart/');
  return data;
};

export const addToCart = async (product_variant, quantity = 1) => {
  const { data } = await api.post('/cart/add/', { product_variant, quantity });
  return data;
};

export const updateCartItem = async (pk, quantity) => {
  const { data } = await api.patch(`/cart/items/${pk}/`, { quantity });
  return data;
};

export const removeCartItem = async (pk) => {
  await api.delete(`/cart/items/${pk}/delete/`);
};
