import API from '../_api';

export const getMyOrders = async () => {
  const { data } = await API.get('/my-orders');
  return data;
};

export const checkout = async (payload) => {
  const { data } = await API.post('/transactions', payload);
  return data;
};

export const getOrder = async (id) => {
  const { data } = await API.get(`/transactions/${id}`);
  return data;
};

export const payOrder = async (id) => {
  const { data } = await API.post(`/transactions/${id}/pay`);
  return data;
};

// Admin
export const getAllOrders = async (params = {}) => {
  const { data } = await API.get('/transactions', { params });
  return data;
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await API.put(`/transactions/${id}/status`, { status });
  return data;
};

export const markOrderPaid = async (id) => {
  const { data } = await API.put(`/transactions/${id}/paid`);
  return data;
};

export const getStats = async () => {
  const { data } = await API.get('/stats');
  return data;
};
