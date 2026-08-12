import api from './api';

export const getOrders = async () => {
  const { data } = await api.get('/orders/');
  return data;
};

export const getOrderDetail = async (pk) => {
  const { data } = await api.get(`/orders/${pk}/`);
  return data;
};

export const createOrder = async (address_id) => {
  const { data } = await api.post('/orders/create/', { address_id });
  return data;
};

export const buyNow = async (address_id, product_variant, quantity) => {
  const { data } = await api.post('/orders/buy-now/', {
    address_id,
    product_variant,
    quantity,
  });
  return data;
};

export const cancelOrder = async (pk) => {
  const { data } = await api.patch(`/orders/${pk}/cancel/`);
  return data;
};

export const createRazorpayOrder = async (order_id) => {
  const { data } = await api.post(`/orders/${order_id}/razorpay-order/`);
  return data;
}

export const verifyRazorpayPayment = async (order_id, paymentData) => {
  const {data} = await api.post(`/orders/${order_id}/razorpay/verify/`,
    paymentData
  );
  return data;
}