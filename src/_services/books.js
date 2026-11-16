import API from '../_api';

export const getBooks = async (params = {}) => {
  const { data } = await API.get('/books', { params });
  return data;
};

export const getBook = async (id) => {
  const { data } = await API.get(`/books/${id}`);
  return data;
};

export const createBook = async (payload) => {
  const { data } = await API.post('/books', payload);
  return data;
};

export const updateBook = async (id, payload) => {
  const { data } = await API.put(`/books/${id}`, payload);
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await API.delete(`/books/${id}`);
  return data;
};
