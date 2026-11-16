import API from '../_api';

export const getCart = async () => {
  const { data } = await API.get('/cart');
  return data;
};

export const addToCart = async (bookId, qty = 1) => {
  const { data } = await API.post('/cart', { book_id: bookId, qty });
  return data;
};

export const updateCartItem = async (id, qty) => {
  const { data } = await API.put(`/cart/${id}`, { qty });
  return data;
};

export const removeCartItem = async (id) => {
  const { data } = await API.delete(`/cart/${id}`);
  return data;
};

export const clearCart = async () => {
  const { data } = await API.delete('/cart');
  return data;
};
