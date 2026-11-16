import API from '../_api';

export const sendMessage = async (payload) => {
  const { data } = await API.post('/messages', payload);
  return data;
};

export const getMessages = async (params = {}) => {
  const { data } = await API.get('/messages', { params });
  return data;
};

export const markMessageRead = async (id) => {
  const { data } = await API.put(`/messages/${id}/read`);
  return data;
};

export const deleteMessage = async (id) => {
  const { data } = await API.delete(`/messages/${id}`);
  return data;
};
